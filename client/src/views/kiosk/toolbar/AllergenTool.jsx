import { useEffect, useRef, useState } from 'react';
import { ALLERGENS } from '../../../config/allergens';
import { useAllergenFilter } from '../../../hooks/useAllergenFilter';

// Header button that opens a dialog for hiding drinks that contain chosen allergens.
export default function AllergenTool() {
  const { avoid, toggle, clear } = useAllergenFilter();
  const [open, setOpen] = useState(false);
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <>
      <button type="button" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>
        Allergens{avoid.length > 0 && <span translate="no"> ({avoid.length})</span>}
      </button>
      <dialog ref={dialogRef} className="a11y-dialog" aria-labelledby="allergen-title"
              data-idle-pause={open ? '' : undefined} onClose={() => setOpen(false)}>
        <h2 id="allergen-title">Hide drinks that contain</h2>
        <p>Choose what to avoid. Drinks with these ingredients will be hidden from the menu.</p>
        {ALLERGENS.OPTIONS.map((name) => {
          const on = avoid.includes(name);
          return (
            <button key={name} type="button" className="a11y-dialog__toggle" aria-pressed={on} onClick={() => toggle(name)}>
              <span>{name}</span>
              <span aria-hidden="true">{on ? 'Hidden' : 'Shown'}</span>
            </button>
          );
        })}
        <p className="allergen-note">
          Allergen info comes from our ingredient list. Please ask staff if you have a severe allergy.
        </p>
        <div className="a11y-dialog__actions">
          <button type="button" disabled={!avoid.length} onClick={clear}>Clear all</button>
          <button type="button" className="a11y-dialog__done" onClick={() => setOpen(false)}>Done</button>
        </div>
      </dialog>
    </>
  );
}
