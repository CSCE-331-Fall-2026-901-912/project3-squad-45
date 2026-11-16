import { useCallback, useState } from 'react';
import { askAssistant } from '../api/chatApi';

// Conversation with the menu assistant. Assistant messages may carry drink suggestions.
export function useChat() {
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const send = useCallback(async (text) => {
    const question = text.trim();
    if (!question || sending) return;
    const history = [...messages, { role: 'user', content: question }];
    setMessages(history);
    setSending(true);
    setError(null);
    try {
      const { reply, suggestions } = await askAssistant(
        history.map(({ role, content }) => ({ role, content })),
        document.documentElement.lang || 'en',
      );
      setMessages([...history, { role: 'assistant', content: reply, suggestions }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }, [messages, sending]);

  const clear = useCallback(() => { setMessages([]); setError(null); }, []);
  return { messages, sending, error, send, clear };
}
