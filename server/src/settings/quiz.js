// Flavor Quiz questions. Each option boosts drinks that share its categories or
// tags, and `excludeTags` removes drinks that carry one of those tags.
export const QUIZ = {
  RESULT_COUNT: 3,
  CATEGORY_WEIGHT: 3,
  TAG_WEIGHT: 2,
  QUESTIONS: [
    {
      id: 'flavor',
      text: 'What sounds good right now?',
      options: [
        { id: 'creamy', label: 'Creamy and rich', categories: ['Milk Tea'], tags: ['creamy'] },
        { id: 'fruity', label: 'Fruity and fresh', categories: ['Fruit Tea'], tags: ['fruity'] },
        { id: 'classic', label: 'Classic tea', categories: ['Classic Tea'], tags: ['classic'] },
        { id: 'icy', label: 'Icy and fun', categories: ['Slush'], tags: ['icy'] },
        { id: 'surprise', label: 'Surprise me', categories: ['Specialty'], tags: [] },
      ],
    },
    {
      id: 'sweetness',
      text: 'How sweet do you like your drink?',
      options: [
        { id: 'light', label: 'Not too sweet', categories: [], tags: ['light'] },
        { id: 'balanced', label: 'Just right', categories: [], tags: ['balanced'] },
        { id: 'sweet', label: 'Very sweet', categories: [], tags: ['sweet'] },
      ],
    },
    {
      id: 'caffeine',
      text: 'Do you want caffeine?',
      options: [
        { id: 'yes', label: 'Yes, please', categories: [], tags: [] },
        { id: 'no', label: 'No caffeine', categories: [], tags: ['caffeine-free'], excludeTags: ['caffeine'] },
      ],
    },
  ],
};
