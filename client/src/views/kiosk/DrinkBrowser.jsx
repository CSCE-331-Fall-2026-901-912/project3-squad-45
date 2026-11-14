import { useState } from 'react';
import { ALL_DRINKS } from '../../config/storeInfo';
import DrinkCard from './DrinkCard';

export default function DrinkBrowser({ products, categories, activeCategory, onCategoryChange, onSelect }) {
  const [search, setSearch] = useState('');
  const term = search.trim().toLowerCase();
  const visible = products.filter((product) =>
    (activeCategory === ALL_DRINKS || product.category === activeCategory)
    && (!term || product.name.toLowerCase().includes(term)));

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
      {visible.length === 0
        ? <p className="empty" role="status">No drinks match your search.</p>
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
