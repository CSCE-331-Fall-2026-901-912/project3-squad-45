import { http } from './http';

export const fetchFeatured = () => http('/api/menu/featured');
export const fetchDrinkDetail = (productId) => http(`/api/menu/${productId}`);
export const fetchQuiz = () => http('/api/quiz');
export const recommendDrinks = (answers) => http('/api/quiz/recommend', { method: 'POST', body: { answers } });
