import { listMenu } from './menuService.js';
import { publicQuestions, rankDrinks, resolvePicks } from '../utils/quiz.js';

export const getQuestions = () => publicQuestions();

export async function recommendDrinks(answers) {
  const picks = resolvePicks(answers);
  return rankDrinks(await listMenu(), picks);
}
