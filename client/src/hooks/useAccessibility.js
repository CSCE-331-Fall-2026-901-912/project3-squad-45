import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { fetchPreferences, savePreferences } from '../api/preferencesApi';
import { ACCESSIBILITY } from '../config/accessibility';

export const AccessibilityContext = createContext(null);

function readStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage can be blocked; settings then last for this visit only.
  }
}

// Anonymous id so a device's settings can be restored. It carries no personal data.
function getDeviceId() {
  let id = readStorage(ACCESSIBILITY.DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    writeStorage(ACCESSIBILITY.DEVICE_ID_KEY, id);
  }
  return id;
}

// Start from what the visitor's system already asks for.
function systemDefaults() {
  const asks = (query) => window.matchMedia?.(query).matches ?? false;
  return {
    ...ACCESSIBILITY.DEFAULTS,
    contrast: asks('(prefers-contrast: more)') ? 'high' : 'normal',
    reduceMotion: asks('(prefers-reduced-motion: reduce)'),
  };
}

function loadInitial() {
  try {
    const saved = JSON.parse(readStorage(ACCESSIBILITY.STORAGE_KEY));
    if (saved) return { settings: { ...ACCESSIBILITY.DEFAULTS, ...saved }, hasSaved: true };
  } catch {
    // Fall through to the defaults when the stored value is unreadable.
  }
  return { settings: systemDefaults(), hasSaved: false };
}

// Applies settings to <html> as data attributes and CSS variables that
// styles/accessibility.css and the idle timer read.
function applyToDocument({ contrast, textSize, largeTargets, moreTime, reduceMotion }) {
  const root = document.documentElement;
  const size = ACCESSIBILITY.TEXT_SIZES.find((option) => option.key === textSize) ?? ACCESSIBILITY.TEXT_SIZES[0];
  root.dataset.contrast = contrast;
  root.dataset.textSize = size.key;
  root.style.setProperty('--a11y-text-scale', size.scale);
  root.dataset.targets = largeTargets ? 'large' : 'normal';
  root.dataset.motion = reduceMotion ? 'reduced' : 'normal';
  root.dataset.idleFactor = moreTime ? ACCESSIBILITY.MORE_TIME_FACTOR : 1;
}

function clearFromDocument() {
  const root = document.documentElement;
  ['contrast', 'textSize', 'targets', 'motion', 'idleFactor'].forEach((name) => delete root.dataset[name]);
  root.style.removeProperty('--a11y-text-scale');
}

export function useAccessibilitySettings() {
  const initial = useRef(loadInitial());
  const [settings, setSettings] = useState(initial.current.settings);
  const saveTimer = useRef(null);

  // A first-time device may already have settings saved on the server.
  useEffect(() => {
    if (initial.current.hasSaved) return;
    fetchPreferences(getDeviceId())
      .then((saved) => { if (saved) setSettings(saved); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    applyToDocument(settings);
    return clearFromDocument;
  }, [settings]);

  const update = useCallback((changes) => {
    setSettings((current) => {
      const next = { ...current, ...changes };
      writeStorage(ACCESSIBILITY.STORAGE_KEY, JSON.stringify(next));
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => savePreferences(getDeviceId(), next).catch(() => {}), ACCESSIBILITY.SAVE_DELAY_MS);
      return next;
    });
  }, []);

  const reset = useCallback(() => update({ ...ACCESSIBILITY.DEFAULTS }), [update]);
  return { settings, update, reset };
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error('useAccessibility must be used inside an AccessibilityProvider');
  return context;
}
