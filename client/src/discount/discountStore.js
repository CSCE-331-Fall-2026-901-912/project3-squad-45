// Small shared store for the visitor's Boba Spin result, so the game dialog and the cart
// can see the same discount without either one importing the other.
const listeners = new Set();

const EMPTY = { playerId: null, played: false, code: null, percent: 0, label: null };
let state = EMPTY;

const publish = (next) => {
  state = next;
  listeners.forEach((listener) => listener());
};

export const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
export const getSnapshot = () => state;

// One anonymous id per kiosk visit, so each visitor gets one spin.
export function getPlayerId() {
  if (!state.playerId) publish({ ...state, playerId: crypto.randomUUID() });
  return state.playerId;
}

export const recordSpin = ({ code, percent, label }) =>
  publish({ ...state, played: true, code: code ?? null, percent: percent ?? 0, label: label ?? null });

// Removes the discount but remembers that this visitor already played.
export const removeDiscount = () => publish({ ...state, code: null, percent: 0, label: null });

// Starts fresh for the next visitor.
export const resetDiscount = () => publish(EMPTY);
