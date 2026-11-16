import { Router } from 'express';
import { getWeather } from '../services/weatherService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(async (req, res) => res.json(await getWeather())));

export default router;
