import { Router } from 'express';
import { getQuestions, recommendDrinks } from '../services/quizService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', (req, res) => res.json({ questions: getQuestions() }));

router.post(
  '/recommend',
  asyncHandler(async (req, res) => res.json({ drinks: await recommendDrinks(req.body?.answers) })),
);

export default router;
