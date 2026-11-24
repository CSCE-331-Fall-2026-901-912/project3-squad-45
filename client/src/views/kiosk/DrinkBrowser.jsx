import { useState } from 'react';
import { ALL_DRINKS } from '../../config/storeInfo';
import { useAllergenFilter } from '../../hooks/useAllergenFilter';
import DrinkCard from './DrinkCard';

export default function DrinkBrowser({ products, categories, activeCategory, onCategoryChange, onSelect }) {
  const [search, setSearch] = useState('');
  const term = search.trim().toLowerCase();
  const { avoid, isSafe } = useAllergenFilter();
  const matching = products.filter((product) =>
    (activeCategory === ALL_DRINKS || product.category === activeCategory)
    && (!term || product.name.toLowerCase().includes(term)));
  const visible = matching.filter(isSafe);
  const hidden = matching.length - visible.length;

  return (
    <section aria-labelledby="browse-heading">
      <h1 id="browse-heading" className="kiosk__heading">Our menu</h1>
      <div className="menu-tools">
        <div className="category-tabs" role="group" aria-label="Drink categories">
          {[ALL_DRINKS, ...categories].map((category) => (
            <button key={category} type="button" className="category-tab" aria-pressed={category === activeCategory}
                    onClick={() => onCategoryChange(category)}>
              {category}
            </button>
          ))}
        </div>
        <label className="search">
          <span className="visually-hidden">Search drinks</span>
          <input type="search" value={search} placeholder="Search drinks" onChange={(event) => setSearch(event.target.value)} />
        </label>
      </div>
      {avoid.length > 0 && (
        <p className="filter-note" role="status">
          Hiding drinks with {avoid.join(', ').toLowerCase()}{hidden > 0 ? ` (${hidden} hidden)` : ''}.
        </p>
      )}
      {visible.length === 0
        ? <p className="empty" role="status">{hidden > 0 ? 'Every drink here contains something you avoid.' : 'No drinks match your search.'}</p>
        : (
          <ul className="drink-grid">
            {visible.map((product) => (
              <li key={product.productId}><DrinkCard product={product} onSelect={onSelect} /></li>
            ))}
          </ul>
        )}
    </section>
  );
}
