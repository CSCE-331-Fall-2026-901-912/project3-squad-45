import { MENU_DETAILS } from '../settings/menu.js';

const includesAny = (text, keywords) => keywords.some((word) => text.toLowerCase().includes(word));

// Joins names like "a, b and c" for short sentences.
function joinNames(names) {
  if (names.length <= 1) return names.join('');
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

export const isFoodItem = (name) => !includesAny(name, MENU_DETAILS.NON_FOOD_KEYWORDS);

export function inferAllergens(ingredientNames) {
  return Object.entries(MENU_DETAILS.ALLERGEN_KEYWORDS)
    .filter(([, keywords]) => ingredientNames.some((name) => includesAny(name, keywords)))
    .map(([allergen]) => allergen);
}

export const containsCaffeine = (ingredientNames) =>
  ingredientNames.some((name) => includesAny(name, MENU_DETAILS.CAFFEINE_KEYWORDS));

// Three short sentences, written for readers who need simple wording.
export function plainDescription({ name, category, ingredients, allergens, hasCaffeine }) {
  const shown = ingredients.slice(0, MENU_DETAILS.PLAIN_MAX_INGREDIENTS).map((item) => item.toLowerCase());
  const sentences = [`${name} is a ${category.toLowerCase()} drink.`];
  if (shown.length) sentences.push(`It has ${joinNames(shown)}.`);
  if (allergens.length) sentences.push(`It has ${joinNames(allergens.map((item) => item.toLowerCase()))} in it.`);
  sentences.push(hasCaffeine ? 'It has caffeine.' : 'It has no caffeine.');
  return sentences.join(' ');
}

// Combines a product row and its recipe rows into the drink detail payload.
export function buildDetail(product, ingredientRows) {
  const ingredients = [...new Set(ingredientRows.map((row) => row.name).filter(isFoodItem))];
  const allergens = inferAllergens(ingredients);
  const hasCaffeine = containsCaffeine(ingredients);
  return {
    ...product,
    ingredients,
    allergens,
    hasCaffeine,
    plainDescription: plainDescription({ ...product, ingredients, allergens, hasCaffeine }),
  };
}
