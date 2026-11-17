import { useEffect, useRef, useState } from 'react';
import { fetchWheel, spinWheel } from '../../../api/gameApi';
import { ErrorMessage, Loading } from '../../../components/StatusMessage';
import { GAME } from '../../../config/game';
import { getPlayerId, recordSpin } from '../../../discount/discountStore';
import { useApi } from '../../../hooks/useApi';
import { useDiscount } from '../../../hooks/useDiscount';
import SpinWheel from './SpinWheel';
import './game.css';

const prefersReducedMotion = () =>
  document.documentElement.dataset.motion === 'reduced'
  || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Modal wheel game. It can always be closed, works by keyboard and has no timer.
export default function SpinDialog({ open, onClose }) {
  const dialogRef = useRef(null);
  const wheel = useApi(fetchWheel);
  const discount = useDiscount();
  const [phase, setPhase] = useState('ready'); // ready | spinning | done
  const [targetIndex, setTargetIndex] = useState(null);
  const [outcome, setOutcome] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  async function handleSpin() {
    setError(null);
    setPhase('spinning');
    try {
      const result = await spinWheel(getPlayerId());
      const segment = wheel.data.segments[result.index];
      const won = { code: result.code, percent: result.percent, label: segment.label };
      setTargetIndex(result.index);
      setOutcome({ ...won, repeat: result.repeat });
      const finish = () => { recordSpin(won); setPhase('done'); };
      if (prefersReducedMotion() || result.repeat) finish();
      else setTimeout(finish, GAME.SPIN_DURATION_MS);
    } catch (err) {
      setError(err);
      setPhase('ready');
    }
  }

  const won = outcome?.percent > 0;
  const spinning = phase === 'spinning';

  return (
    <dialog ref={dialogRef} className="spin-dialog" aria-labelledby="spin-title"
            data-idle-pause={open ? '' : undefined} onClose={onClose}>
      <h2 id="spin-title">Boba Spin</h2>
      {wheel.error && <ErrorMessage error={wheel.error} onRetry={wheel.reload} />}
      {wheel.loading && <Loading />}
      {wheel.data && (
        <>
          <SpinWheel segments={wheel.data.segments} targetIndex={targetIndex} spinning={spinning} />
          <div className="spin-dialog__result" role="status" aria-live="polite">
            {phase === 'ready' && !discount.played && 'Spin once for a chance at a discount on your order.'}
            {phase === 'ready' && discount.played && 'You already played this visit.'}
            {spinning && 'Spinning…'}
            {phase === 'done' && won && `You won ${outcome.label}! It is applied to your order.`}
            {phase === 'done' && !won && 'Not this time. Thanks for playing!'}
          </div>
          {error && <ErrorMessage error={error} />}
        </>
      )}
      <div className="spin-dialog__actions">
        <button type="button" className="big-btn big-btn--primary" disabled={!wheel.data || spinning || discount.played || phase === 'done'}
                onClick={handleSpin}>
          Spin the wheel
        </button>
        <button type="button" className="big-btn" onClick={onClose} disabled={spinning}>
          {phase === 'done' ? 'Done' : 'No thanks'}
        </button>
      </div>
    </dialog>
  );
}
