import { useEffect } from 'react';

const ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'touchstart'];
// An element with this attribute (a settings dialog, a game) holds the timer off while it is on screen.
const PAUSE_SELECTOR = '[data-idle-pause]';

// "More time" in the accessibility settings sets this multiplier on <html>.
const idleFactor = () => Number(document.documentElement.dataset.idleFactor) || 1;

// Calls `onIdle` after `timeoutMs` without interaction; disabled when `active` is false.
export function useIdleReset(active, timeoutMs, onIdle) {
  useEffect(() => {
    if (!active) return undefined;
    let timer;
    const restart = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (document.querySelector(PAUSE_SELECTOR)) restart();
        else onIdle();
      }, timeoutMs * idleFactor());
    };
    restart();
    ACTIVITY_EVENTS.forEach((name) => window.addEventListener(name, restart));
    return () => {
      clearTimeout(timer);
      ACTIVITY_EVENTS.forEach((name) => window.removeEventListener(name, restart));
    };
  }, [active, timeoutMs, onIdle]);
}
