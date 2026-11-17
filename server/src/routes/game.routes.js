import { Router } from 'express';
import { GAME } from '../settings/game.js';
import { lookupCode, spin } from '../services/gameService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { badRequest } from '../utils/httpError.js';
import { isUuid } from '../utils/uuid.js';
import { normalizeCode, publicSegments } from '../utils/wheel.js';

const router = Router();

router.get('/wheel', (req, res) => res.json({ segments: publicSegments() }));

router.post(
  '/spin',
  asyncHandler(async (req, res) => {
    const { playerId } = req.body ?? {};
    if (!isUuid(playerId)) throw badRequest('Invalid player id');
    const result = await spin(playerId, req.ip);
    const index = GAME.SEGMENTS.findIndex((segment) => segment.id === result.segmentId);
    res.json({ ...result, index });
  }),
);

router.get(
  '/code/:code',
  asyncHandler(async (req, res) => res.json(await lookupCode(normalizeCode(req.params.code)))),
);

export default router;
