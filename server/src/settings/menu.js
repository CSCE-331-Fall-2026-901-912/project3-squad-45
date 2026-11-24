// Settings for kiosk menu browsing and drink details.
export const MENU_DETAILS = {
  FEATURED_COUNT: 6,
  // Inventory rows that are supplies, not ingredients a customer drinks.
  NON_FOOD_KEYWORDS: ['cup', 'lid', 'straw', 'napkin', 'bag'],
  // An allergen is listed when an ingredient name contains one of its keywords.
  ALLERGEN_KEYWORDS: {
    Milk: ['milk', 'creamer'],
    Soy: ['soy'],
    Egg: ['egg', 'pudding'],
    Peanuts: ['peanut'],
    'Tree nuts': ['almond', 'cashew', 'hazelnut', 'walnut', 'pistachio'],
    Gluten: ['wheat', 'barley'],
  },
  CAFFEINE_KEYWORDS: ['tea leaves', 'matcha'],
  // Plain-language summaries stay short for readers who need simple wording.
  PLAIN_MAX_INGREDIENTS: 4,
};
