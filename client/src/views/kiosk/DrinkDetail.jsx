import { useEffect, useRef } from 'react';
import { fetchDrinkDetail } from '../../api/kioskApi';
import { ErrorMessage, Loading } from '../../components/StatusMessage';
import { useApi } from '../../hooks/useApi';
import { formatMoney } from '../../utils/money';
import DrinkArt from './DrinkArt';

// `data-plain-text` is the contract with the language tool: when plain-language mode is on,
// the text of an element carrying it is replaced by that simpler wording.
export default function DrinkDetail({ product, onBack, onCustomize }) {
  const detail = useApi(() => fetchDrinkDetail(product.productId), [product.productId]);
  const headingRef = useRef(null);
  useEffect(() => headingRef.current?.focus(), []);

  if (detail.error) return <ErrorMessage error={detail.error} onRetry={detail.reload} />;
  if (detail.loading) return <Loading />;
  const drink = detail.data;

  return (
    <article className="detail" aria-labelledby="detail-heading">
      <DrinkArt category={drink.category} imageUrl={drink.imageUrl} className="detail__art" />
      <div className="detail__body">
        <p className="eyebrow">{drink.category}</p>
        <h1 id="detail-heading" tabIndex={-1} ref={headingRef}>{drink.name}</h1>
        <p className="detail__price" translate="no">{formatMoney(drink.price)}</p>
        {drink.description && <p className="detail__desc" data-plain-text={drink.plainDescription}>{drink.description}</p>}

        <h2 className="detail__label">What is in it</h2>
        <ul className="chips">
          {drink.ingredients.map((name) => <li key={name} className="chip">{name}</li>)}
        </ul>

        <h2 className="detail__label">Good to know</h2>
        <ul className="chips">
          <li className={`chip ${drink.hasCaffeine ? '' : 'chip--good'}`}>{drink.hasCaffeine ? 'Contains caffeine' : 'No caffeine'}</li>
          {drink.allergens.map((name) => <li key={name} className="chip chip--warn">Contains {name.toLowerCase()}</li>)}
        </ul>

        <div className="kiosk__actions">
          <button type="button" className="big-btn" onClick={onBack}>Back to menu</button>
          <button type="button" className="big-btn big-btn--primary" onClick={() => onCustomize(drink)}>
            Customize and add
          </button>
        </div>
      </div>
    </article>
  );
}
