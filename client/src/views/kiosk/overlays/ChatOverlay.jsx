import { useEffect, useRef, useState } from 'react';
import { fetchChatStatus } from '../../../api/chatApi';
import { CHAT } from '../../../config/chat';
import { useChat } from '../../../hooks/useChat';
import { defaultLine } from '../../../utils/defaultLine';
import { formatMoney } from '../../../utils/money';
import '../chat.css';

// Floating menu assistant. Picked up by kioskSlots and receives { options, cart, onSelectProduct }.
export default function ChatOverlay({ options, cart, onSelectProduct }) {
  const [open, setOpen] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [draft, setDraft] = useState('');
  const { messages, sending, error, send, clear } = useChat();
  const logRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    fetchChatStatus().then((data) => setEnabled(data.enabled)).catch(() => setEnabled(false));
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    logRef.current?.scrollTo?.({ top: logRef.current.scrollHeight });
  }, [messages, sending]);

  function submit(event) {
    event.preventDefault();
    send(draft);
    setDraft('');
  }

  if (!open) {
    return (
      <button type="button" className="chat-launcher" aria-haspopup="dialog" onClick={() => setOpen(true)}>
        <span aria-hidden="true">💬 </span>Ask our assistant
      </button>
    );
  }

  return (
    <aside className="chat" aria-label="Menu assistant">
      <header className="chat__header">
        <h2>Menu assistant</h2>
        <div>
          {messages.length > 0 && <button type="button" onClick={clear}>Start over</button>}
          <button type="button" onClick={() => setOpen(false)}>Close</button>
        </div>
      </header>

      <div className="chat__log" ref={logRef} role="log" aria-live="polite">
        <p className="chat__bubble chat__bubble--assistant">{enabled ? CHAT.GREETING : CHAT.UNAVAILABLE}</p>
        {enabled && messages.length === 0 && (
          <ul className="chat__starters">
            {CHAT.STARTER_QUESTIONS.map((question) => (
              <li key={question}><button type="button" onClick={() => send(question)}>{question}</button></li>
            ))}
          </ul>
        )}
        {messages.map((message, index) => (
          <div key={index} className={`chat__message chat__message--${message.role}`}>
            {/* Assistant replies already match the customer's language, so they are not translated again. */}
            <p className={`chat__bubble chat__bubble--${message.role}`} translate="no">{message.content}</p>
            {message.suggestions?.length > 0 && (
              <ul className="chat__suggestions">
                {message.suggestions.map((product) => (
                  <li key={product.productId} className="chat__suggestion">
                    <span translate="no">{product.name} · {formatMoney(product.price)}</span>
                    <button type="button" onClick={() => { onSelectProduct(product); setOpen(false); }}>Details</button>
                    <button type="button" onClick={() => cart.addLine(defaultLine(product, options))}>Add to order</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        {sending && <p className="chat__bubble chat__bubble--assistant" role="status">Thinking…</p>}
        {error && <p className="status status--error" role="alert">{error}</p>}
      </div>

      {enabled && (
        <form className="chat__form" onSubmit={submit}>
          <input ref={inputRef} value={draft} maxLength={CHAT.MAX_MESSAGE_LENGTH} onChange={(event) => setDraft(event.target.value)}
                 aria-label="Ask a question about our drinks" placeholder="Ask about our drinks" />
          <button type="submit" disabled={sending || !draft.trim()}>Send</button>
        </form>
      )}
    </aside>
  );
}
