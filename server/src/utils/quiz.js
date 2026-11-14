import { QUIZ } from '../settings/quiz.js';
import { badRequest } from './httpError.js';

// Turns { questionId: optionId } into the chosen option objects; throws a 400 for unknown ids.
export function resolvePicks(answers, questions = QUIZ.QUESTIONS) {
  if (!answers || typeof answers !== 'object') throw badRequest('Answers are required');
  return questions.map((question) => {
    const option = question.options.find((candidate) => candidate.id === answers[question.id]);
    if (!option) throw badRequest(`Please answer: ${question.text}`);
    return option;
  });
}

export function scoreProduct(product, picks, weights = QUIZ) {
  const tags = product.tags ?? [];
  if (picks.some((pick) => (pick.excludeTags ?? []).some((tag) => tags.includes(tag)))) return -1;
  return picks.reduce((score, pick) => (
    score
    + (pick.categories.includes(product.category) ? weights.CATEGORY_WEIGHT : 0)
    + pick.tags.filter((tag) => tags.includes(tag)).length * weights.TAG_WEIGHT
  ), 0);
}

// Best matches first; ties go to the more popular drink, then to the name.
export function rankDrinks(products, picks, limit = QUIZ.RESULT_COUNT) {
  return products
    .map((product) => ({ product, score: scoreProduct(product, picks) }))
    .filter((entry) => entry.score >= 0)
    .sort((a, b) => b.score - a.score
      || (b.product.popularity ?? 0) - (a.product.popularity ?? 0)
      || a.product.name.localeCompare(b.product.name))
    .slice(0, limit)
    .map((entry) => entry.product);
}

// Strips internal scoring fields before questions go to the browser.
export const publicQuestions = (questions = QUIZ.QUESTIONS) =>
  questions.map(({ id, text, options }) => ({
    id,
    text,
    options: options.map(({ id: optionId, label }) => ({ id: optionId, label })),
  }));
