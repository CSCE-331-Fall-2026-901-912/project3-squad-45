import { useState } from 'react';
import { fetchWheel } from '../../../api/gameApi';
import { useApi } from '../../../hooks/useApi';
import { useDiscount } from '../../../hooks/useDiscount';
import SpinDialog from '../game/SpinDialog';
import '../game/game.css';

// Home page promotion that opens the Boba Spin game. Picked up by kioskSlots.
export default function PromoSection() {
  const [open, setOpen] = useState(false);
  const wheel = useApi(fetchWheel);
  const discount = useDiscount();
  const best = wheel.data ? Math.max(...wheel.data.segments.map((segment) => segment.percent)) : null;
  if (wheel.error) return null; // The promotion is optional; the rest of the page still works.

  return (
    <section className="promo" aria-labelledby="promo-heading">
      <div>
        <p className="eyebrow">Today only</p>
        <h2 id="promo-heading" className="promo__title">Spin the Boba Wheel</h2>
        <p>
          {discount.code
            ? `Your ${discount.label} is applied to this order.`
            : `One spin per visit${best ? `, up to ${best}% off your order` : ''}.`}
        </p>
      </div>
      <button type="button" className="big-btn big-btn--accent" onClick={() => setOpen(true)} disabled={!wheel.data}>
        {discount.played ? 'See the wheel' : 'Play now'}
      </button>
      <SpinDialog open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
