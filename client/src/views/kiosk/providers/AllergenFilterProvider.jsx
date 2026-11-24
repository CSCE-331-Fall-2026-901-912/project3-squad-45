import { AllergenFilterContext, useAllergenFilterState } from '../../../hooks/useAllergenFilter';

// Picked up by kioskSlots: shares which allergens the visitor wants to avoid.
export default function AllergenFilterProvider({ children }) {
  const value = useAllergenFilterState();
  return <AllergenFilterContext.Provider value={value}>{children}</AllergenFilterContext.Provider>;
}
