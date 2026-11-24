import { I18N } from '../config/i18n.js';
import { chunk, isTranslatable, lookupDictionary, matchWhitespace } from './textRules.js';

// Translates everything under `root` in place and keeps it translated as React re-renders.
// Original text is remembered so switching back to English restores it exactly.
//
// Contract with page content:
//   translate="no"       the element (and its children) is never translated
//   data-plain-text="…"  with plain-language mode on, the element's text is replaced by this wording
export class DomTranslator {
  constructor({ root, fetchTranslations, dictionaries, onStatus = () => {} }) {
    this.root = root;
    this.fetchTranslations = fetchTranslations;
    this.dictionaries = dictionaries;
    this.onStatus = onStatus;
    this.language = I18N.SOURCE_LANGUAGE;
    this.plain = false;
    this.cache = new Map(); // language -> Map(source text -> translation)
    this.failed = new Set(); // "language|text" keys that the service could not translate
    this.queued = new Set();
    this.inflight = 0;
    this.timer = null;
    this.textOriginals = new Map(); // Text node -> original value
    this.textApplied = new Map(); // Text node -> value we wrote
    this.attrOriginals = new Map(); // Element -> Map(attribute -> original)
    this.attrApplied = new Map(); // Element -> Map(attribute -> value we wrote)
    this.observer = new MutationObserver((mutations) => this.onMutations(mutations));
  }

  start() {
    this.observer.observe(this.root, {
      subtree: true, childList: true, characterData: true,
      attributes: true, attributeFilter: I18N.TRANSLATED_ATTRIBUTES,
    });
    this.scan(this.root);
  }

  stop() {
    this.observer.disconnect();
    clearTimeout(this.timer);
    this.restoreAll();
  }

  configure({ language, plain }) {
    if (language === this.language && plain === this.plain) return;
    const languageChanged = language !== this.language;
    this.language = language;
    this.plain = plain;
    // A failure belongs to the language it happened in, so a new language starts clean.
    if (languageChanged) this.onStatus({ busy: false, error: false });
    this.restoreAll();
    this.scan(this.root);
  }

  // ---------- Scanning ----------
  scan(node) {
    if (node.nodeType === Node.TEXT_NODE) { this.handleText(node); return; }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    this.handleAttributes(node);
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) this.handleText(walker.currentNode);
    node.querySelectorAll(`[${I18N.TRANSLATED_ATTRIBUTES.join('],[')}]`).forEach((el) => this.handleAttributes(el));
  }

  onMutations(mutations) {
    for (const mutation of mutations) {
      if (mutation.type === 'characterData') this.handleText(mutation.target);
      else if (mutation.type === 'attributes') this.handleAttributes(mutation.target);
      else mutation.addedNodes.forEach((added) => this.scan(added));
    }
  }

  isSkipped(element) {
    return !element || Boolean(element.closest(I18N.SKIP_SELECTOR));
  }

  // ---------- Text nodes ----------
  handleText(node) {
    if (this.isSkipped(node.parentElement)) return;
    const current = node.nodeValue;
    if (this.textApplied.get(node) === current) return; // our own write
    this.textApplied.delete(node);
    this.textOriginals.set(node, current);

    const replaced = this.translateValue(this.plainSource(node.parentElement) ?? current);
    if (replaced !== undefined && replaced !== current.trim()) {
      const next = matchWhitespace(current, replaced);
      this.textApplied.set(node, next);
      node.nodeValue = next;
    }
  }

  plainSource(element) {
    return this.plain ? element?.dataset?.plainText : undefined;
  }

  // ---------- Attributes ----------
  handleAttributes(element) {
    if (this.isSkipped(element)) return;
    for (const attribute of I18N.TRANSLATED_ATTRIBUTES) {
      const current = element.getAttribute(attribute);
      if (current === null) continue;
      const applied = this.attrApplied.get(element);
      if (applied?.get(attribute) === current) continue;
      this.remember(this.attrOriginals, element, attribute, current);
      applied?.delete(attribute);
      const replaced = this.translateValue(current);
      if (replaced !== undefined && replaced !== current) {
        this.remember(this.attrApplied, element, attribute, replaced);
        element.setAttribute(attribute, replaced);
      }
    }
  }

  remember(store, element, attribute, value) {
    if (!store.has(element)) store.set(element, new Map());
    store.get(element).set(attribute, value);
  }

  // ---------- Translation lookup ----------
  // Returns the translation, the text itself when nothing needs translating, or
  // undefined when it has been queued and will be applied by the next scan.
  translateValue(source) {
    const text = source.trim();
    if (!isTranslatable(text) || I18N.KEEP_AS_IS.includes(text)) return text;
    if (this.language === I18N.SOURCE_LANGUAGE) return text;
    const known = lookupDictionary(this.dictionaries, this.language, text) ?? this.cache.get(this.language)?.get(text);
    if (known !== undefined) return known;
    if (!this.failed.has(`${this.language}|${text}`)) this.enqueue(text);
    return undefined;
  }

  enqueue(text) {
    this.queued.add(text);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.flush(), I18N.BATCH_DELAY_MS);
  }

  async flush() {
    const language = this.language;
    const texts = [...this.queued];
    this.queued.clear();
    for (const batch of chunk(texts, I18N.MAX_BATCH_SIZE)) {
      this.inflight += 1;
      this.onStatus({ busy: true, error: false });
      try {
        const translations = await this.fetchTranslations(language, batch);
        if (!this.cache.has(language)) this.cache.set(language, new Map());
        batch.forEach((text, index) => this.cache.get(language).set(text, translations[index]));
        if (language === this.language) this.onStatus({ busy: this.inflight > 1, error: false });
      } catch {
        batch.forEach((text) => this.failed.add(`${language}|${text}`));
        // Ignore failures from a language the customer has already left.
        if (language === this.language) this.onStatus({ busy: this.inflight > 1, error: true });
      } finally {
        this.inflight -= 1;
      }
    }
    if (language === this.language) this.scan(this.root);
  }

  // ---------- Restoring ----------
  restoreAll() {
    for (const [node, original] of this.textOriginals) {
      if (!node.isConnected) { this.textOriginals.delete(node); this.textApplied.delete(node); continue; }
      if (this.textApplied.has(node)) node.nodeValue = original;
    }
    this.textApplied.clear();
    for (const [element, originals] of this.attrOriginals) {
      if (!element.isConnected) { this.attrOriginals.delete(element); this.attrApplied.delete(element); continue; }
      for (const [attribute, original] of originals) {
        if (this.attrApplied.get(element)?.has(attribute)) element.setAttribute(attribute, original);
      }
    }
    this.attrApplied.clear();
  }
}
