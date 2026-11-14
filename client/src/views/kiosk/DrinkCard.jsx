import { formatMoney } from '../../utils/money';
import DrinkArt from './DrinkArt';

const BADGE_TAG = 'caffeine-free';

// A product tile used on the home page, the full menu and the quiz results.
export default function DrinkCard({ product, onSelect }) {
  const noCaffeine = product.tags?.includes(BADGE_TAG);
  return (
    <button type="button" className="drink-card" onClick={() => onSelect(product)}>
      <DrinkArt category={product.category} imageUrl={product.imageUrl} className="drink-card__art" />
      <span className="drink-card__body">
        <span className="drink-card__category">{product.category}</span>
        <span className="drink-card__name">{product.name}</span>
        {product.description && <span className="drink-card__desc">{product.description}</span>}
        <span className="drink-card__foot">
          <span className="drink-card__price" translate="no">{formatMoney(product.price)}</span>
          {noCaffeine && <span className="badge">No caffeine</span>}
        </span>
      </span>
    </button>
  );
}
