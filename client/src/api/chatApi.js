import { http } from './http';

export const fetchChatStatus = () => http('/api/chat/status');
export const askAssistant = (messages, language) =>
  http('/api/chat', { method: 'POST', body: { messages, language } });
