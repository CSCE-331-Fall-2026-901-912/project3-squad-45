import { http } from './http';

export const fetchWheel = () => http('/api/game/wheel');
export const spinWheel = (playerId) => http('/api/game/spin', { method: 'POST', body: { playerId } });
