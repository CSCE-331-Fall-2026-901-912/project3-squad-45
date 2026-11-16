import { useEffect, useRef, useState } from 'react';
import { ACCESSIBILITY } from '../../../config/accessibility';
import { useAccessibility } from '../../../hooks/useAccessibility';

const TOGGLES = [
  { key: 'highContrast', label: 'High contrast', isOn: (s) => s.contrast === 'high', change: (on) => ({ contrast: on ? 'high' : 'normal' }) },
  { key: 'largeTargets', label: 'Larger buttons', isOn: (s) => s.largeTargets, change: (on) => ({ largeTargets: on }) },
  { key: 'moreTime', label: 'More time', isOn: (s) => s.moreTime, change: (on) => ({ moreTime: on }) },
  { key: 'reduceMotion', label: 'Reduce motion', isOn: (s) => s.reduceMotion, change: (on) => ({ reduceMotion: on }) },
];

// Header button that opens the accessibility settings dialog.
export default function AccessibilityTool() {
  const { settings, update, reset } = useAccessibility();
  const [open, setOpen] = useState(false);
  const dialogRef = useRef(null);
  const sizeIndex = Math.max(0, ACCESSIBILITY.TEXT_SIZES.findIndex((size) => size.key === settings.textSize));
  const lastSize = ACCESSIBILITY.TEXT_SIZES.length - 1;

  // The native dialog traps focus, closes on Escape and returns focus to the button.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const setSize = (index) => update({ textSize: ACCESSIBILITY.TEXT_SIZES[index].key });

  return (
    <>
      <button type="button" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>
        <span aria-hidden="true">♿ </span>Accessibility
      </button>
      <dialog ref={dialogRef} className="a11y-dialog" aria-labelledby="a11y-title"
              data-idle-pause={open ? '' : undefined} onClose={() => setOpen(false)}>
        <h2 id="a11y-title">Accessibility settings</h2>

        <div className="a11y-dialog__row">
          <span id="a11y-size-label">Text size: {ACCESSIBILITY.TEXT_SIZES[sizeIndex].label}</span>
          <div role="group" aria-labelledby="a11y-size-label" className="a11y-dialog__size">
            <button type="button" aria-label="Smaller text" disabled={sizeIndex === 0} onClick={() => setSize(sizeIndex - 1)}>A−</button>
            <button type="button" aria-label="Larger text" disabled={sizeIndex === lastSize} onClick={() => setSize(sizeIndex + 1)}>A+</button>
          </div>
        </div>

        {TOGGLES.map((toggle) => {
          const on = toggle.isOn(settings);
          return (
            <button key={toggle.key} type="button" className="a11y-dialog__toggle" aria-pressed={on}
                    onClick={() => update(toggle.change(!on))}>
              <span>{toggle.label}</span>
              <span aria-hidden="true">{on ? 'On' : 'Off'}</span>
            </button>
          );
        })}

        <div className="a11y-dialog__actions">
          <button type="button" onClick={reset}>Reset all</button>
          <button type="button" className="a11y-dialog__done" onClick={() => setOpen(false)}>Done</button>
        </div>
      </dialog>
    </>
  );
}
