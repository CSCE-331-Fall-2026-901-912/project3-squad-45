import { Router } from 'express';
import { getPreferences, savePreferences } from '../services/preferencesService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { badRequest } from '../utils/httpError.js';
import { normalizePreferences } from '../utils/preferences.js';
import { isUuid } from '../utils/uuid.js';

const router = Router();

function parseDeviceId(req) {
  if (!isUuid(req.params.deviceId)) throw badRequest('Invalid device id');
  return req.params.deviceId;
}

// Responds with { settings: null } when this device has nothing saved yet.
router.get(
  '/:deviceId',
  asyncHandler(async (req, res) => res.json({ settings: await getPreferences(parseDeviceId(req)) })),
);

router.put(
  '/:deviceId',
  asyncHandler(async (req, res) => {
    const settings = normalizePreferences(req.body?.settings);
    res.json({ settings: await savePreferences(parseDeviceId(req), settings) });
  }),
);

export default router;
