import { Router } from 'express';
import { CHAT } from '../settings/chat.js';
import { rateLimit } from '../middleware/rateLimit.js';
import { askAssistant, chatEnabled } from '../services/chatService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/status', (req, res) => res.json({ enabled: chatEnabled() }));

router.post(
  '/',
  rateLimit(CHAT.RATE_LIMIT),
  asyncHandler(async (req, res) => {
    const language = typeof req.body?.language === 'string' ? req.body.language.slice(0, 10) : 'en';
    res.json(await askAssistant(req.body?.messages, language));
  }),
);

export default router;
