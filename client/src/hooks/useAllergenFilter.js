import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ALLERGENS } from '../config/allergens';

export const AllergenFilterContext = createContext(null);

function readSaved() {
  try {
    const saved = JSON.parse(localStorage.getItem(ALLERGENS.STORAGE_KEY));
    return Array.isArray(saved) ? saved.filter((name) => ALLERGENS.OPTIONS.includes(name)) : [];
  } catch {
    return [];
  }
}

function save(list) {
  try {
    localStorage.setItem(ALLERGENS.STORAGE_KEY, JSON.stringify(list));
  } catch {
    // Storage can be blocked; the choice then lasts for this visit only.
  }
}

export function useAllergenFilterState() {
  const [avoid, setAvoid] = useState(readSaved);

  const update = useCallback((next) => { setAvoid(next); save(next); }, []);
  const toggle = useCallback((name) => update(avoid.includes(name) ? avoid.filter((item) => item !== name) : [...avoid, name]), [avoid, update]);
  const clear = useCallback(() => update([]), [update]);

  // A drink is safe only when its allergen list is known and has nothing the visitor avoids.
  const isSafe = useCallback((product) => !avoid.length || (Array.isArray(product.allergens) && !product.allergens.some((name) => avoid.includes(name))), [avoid]);
  const filter = useCallback((products) => products.filter(isSafe), [isSafe]);

  return useMemo(() => ({ avoid, toggle, clear, isSafe, filter }), [avoid, toggle, clear, isSafe, filter]);
}

export function useAllergenFilter() {
  const context = useContext(AllergenFilterContext);
  if (!context) throw new Error('useAllergenFilter must be used inside an AllergenFilterProvider');
  return context;
}
