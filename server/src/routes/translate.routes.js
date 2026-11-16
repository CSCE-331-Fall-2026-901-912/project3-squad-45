import { Router } from 'express';
import { TRANSLATE } from '../settings/translate.js';
import { translateTexts, translationEnabled } from '../services/translateService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { parseTranslateRequest } from '../utils/translateRequest.js';

const router = Router();

// Languages the kiosk offers; `enabled` is false when no API key is configured.
router.get('/languages', (req, res) =>
  res.json({ languages: TRANSLATE.LANGUAGES, enabled: translationEnabled() }));

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { language, texts } = parseTranslateRequest(req.body);
    if (language === TRANSLATE.SOURCE_LANGUAGE) return res.json({ translations: texts });
    res.json({ translations: await translateTexts(language, texts) });
  }),
);

export default router;
