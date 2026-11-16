# Sprint 2 plan

**Sprint goal:** turn the Customer Kiosk from a plain order form into an explore-first, accessible, multilingual experience, and add the external APIs and beyond features the team size requires.

Release due **Mon 11/16, 11:59pm** (5 days from 11/11). Tag the release `v0.2-sprint2` in the class GitHub org.

## Requirements this sprint covers (team of 5)
| Requirement | Our answer | Owner |
|---|---|---|
| Accessibility personas (3) | Maria, Vishnu, Carol | Allen (Maria), Advaith (Vishnu, Carol) |
| External API: Machine Translation | Google Cloud Translation (server proxy and DB cache) | Allen |
| External API: Weather | Open-Meteo | Jeremiah |
| External API: Personal Assistant (5+) | Claude API (server proxy) | Jeremiah |
| Beyond feature 1 (n - 3 = 2) | Boba Spin game for a discount | Nikhil |
| Beyond feature 2 | Flavor Quiz drink recommender | Kavya |
| Kiosk redesign (explore first) | Landing, drink detail, new theme | Kavya |

Beyond features must not double as an external API. The weather banner is part of the Weather API requirement, not a beyond feature.

## Ground rules
- **Everyone commits to both frontend and backend.** Each person below has at least one client commit and one server commit.
- **At least 4 commits each.** The plan gives 5-6 each so nobody falls short.
- **Tests.** Server tests live in `server/test/`; client tests sit next to the file. Run `npm test` before pushing.
- **Commit to `main` with the handoff scripts.** Each person's files never overlap, so there are no merge conflicts. Run `git pull --rebase` before pushing (the script does it).
- **No hardcoded values.** Put tunable values (wheel odds, discount percent, cache TTL, text-size steps, API URLs) in `server/src/settings/<feature>.js` or `client/src/config/<feature>.js`.
- **Secrets** go in `server/.env` and the Render dashboard, never in git. Update `server/.env.example` with the new keys.
- **Commit messages:** `type(scope): what and why`, for example `feat(kiosk): add rainy-day banner`.
- **Do not edit a teammate's files.** If you need a change in one, ask the owner. That keeps commits conflict-free.

## Timeline
The code is written and tested; the work left is committing it, deploying and checking it.

| Date | What happens |
|---|---|
| Wed 11/11 | Everyone unzips their files and makes commit 1 (and more if they like). Run `npm run migrate` once against the team database |
| Thu 11/12 | Everyone finishes their commits and pushes. Spread them over the day; do not push all at once |
| Fri 11/13 | Set `GOOGLE_TRANSLATE_API_KEY` and `ANTHROPIC_API_KEY` on Render, deploy, and fix anything the live site shows |
| Sat 11/14 | Run the accessibility checks in `docs/ACCESSIBILITY_AUDIT.md` and fill in the results. Everyone reads their own code so they can explain it |
| Sun 11/15 | Feature freeze. Tag `v0.2-sprint2`, write the GitHub Release notes, rehearse the 10 minute demo |
| Mon 11/16 | Final deployed check. Submit the release link and the Portal link before 11:59pm |

---

## Kavya: Kiosk redesign and Flavor Quiz (6 commits)
Lead for the explore-first, real-website look: sticky header, hero, categories, best sellers, drink pages, footer. Also owns the release notes.

| # | Commit | Files |
|---|---|---|
| 1 | `feat(db): add drink description, image and flavor tag columns` | `db/migrations/005_menu_details.sql`, `settings/menu.js` |
| 2 | `feat(menu): add featured and drink detail endpoints` | `utils/menuDetails.js`, `services/menuService.js`, `routes/menu.routes.js`, `server/test/menuDetails.test.js` |
| 3 | `feat(quiz): add Flavor Quiz endpoints that rank drinks from answers` | `settings/quiz.js`, `utils/quiz.js`, `services/quizService.js`, `routes/quiz.routes.js`, `server/test/quiz.test.js` |
| 4 | `feat(kiosk): add drink cards, drink detail page, flavor quiz and menu search` | `api/kioskApi.js`, `config/storeInfo.js`, `kiosk/DrinkArt.jsx`, `kiosk/DrinkCard.jsx`, `kiosk/DrinkDetail.jsx`, `kiosk/FlavorQuiz.jsx`, `kiosk/DrinkBrowser.jsx` |
| 5 | `feat(kiosk): redesign the kiosk as an explore-first storefront with feature slots` | `kiosk/SiteHeader.jsx`, `kiosk/SiteFooter.jsx`, `kiosk/ExploreScreen.jsx`, `kiosk/WelcomeScreen.jsx`, `kiosk/KioskView.jsx`, `kiosk/kioskSlots.jsx`, `kiosk/kiosk.css` |
| 6 | `docs: document Sprint 2 features, env keys and Render migrations` | `README.md`, `render.yaml`, `server/.env.example`, `docs/SPRINT2_PLAN.md` |

## Allen: Translation, persona Maria (5 commits)
Not a plain API call: a glossary, protected brand names, a database cache, a DOM translator that also covers screen reader labels, and a Simple words mode.

| # | Commit | Files |
|---|---|---|
| 1 | `feat(db): add translation cache table and translation settings` | `db/migrations/006_translation_cache.sql`, `settings/translate.js` |
| 2 | `feat(translate): add /api/translate proxy with cache and boba glossary` | `utils/glossary.js`, `utils/translateRequest.js`, `services/translateService.js`, `routes/translate.routes.js`, `server/test/translate.test.js` |
| 3 | `feat(i18n): add DOM translator and text rules` | `config/i18n.js`, `api/translateApi.js`, `i18n/textRules.js`, `i18n/textRules.test.js`, `i18n/DomTranslator.js` |
| 4 | `feat(i18n): add language context, Spanish dictionary and kiosk provider` | `i18n/uiDictionary.js`, `i18n/LanguageContext.jsx`, `hooks/useTranslate.js`, `kiosk/providers/LanguageProvider.jsx` |
| 5 | `feat(kiosk): add language picker and Simple words mode to the toolbar` | `kiosk/toolbar/LanguageTool.jsx`, `i18n/language.css` |

## Advaith: Accessibility, personas Vishnu and Carol (6 commits)
High contrast, text size, larger buttons, more time, reduced motion, and the audit checklist.

| # | Commit | Files |
|---|---|---|
| 1 | `feat(a11y): add high-contrast theme, text scaling, large targets and reduced motion` | `styles/accessibility.css` |
| 2 | `feat(a11y): add accessibility settings state with local and saved storage` | `config/accessibility.js`, `hooks/useAccessibility.js`, `kiosk/providers/AccessibilityProvider.jsx`, `api/preferencesApi.js` |
| 3 | `feat(a11y): add accessibility settings dialog to the kiosk toolbar` | `kiosk/toolbar/AccessibilityTool.jsx` |
| 4 | `fix(a11y): hold the idle reset while dialogs are open and extend it for More time` | `hooks/useIdleReset.js` |
| 5 | `feat(preferences): add anonymous per-device accessibility settings API` | `db/migrations/007_accessibility_preferences.sql`, `settings/preferences.js`, `utils/uuid.js`, `utils/preferences.js`, `services/preferencesService.js`, `routes/preferences.routes.js`, `server/test/preferences.test.js` |
| 6 | `docs(a11y): add accessibility audit checklist for personas Vishnu and Carol` | `docs/ACCESSIBILITY_AUDIT.md` |

## Nikhil: Boba Spin game and discounts (6 commits)
The reward is issued and checked by the server, so the browser cannot forge a discount.

| # | Commit | Files |
|---|---|---|
| 1 | `feat(db): add Boba Spin tables and discount columns on orders` | `db/migrations/008_game_discounts.sql`, `settings/game.js` |
| 2 | `feat(game): add spin endpoint that issues single-use discount codes` | `utils/wheel.js`, `services/gameService.js`, `routes/game.routes.js`, `server/test/game.test.js` |
| 3 | `feat(orders): apply and redeem discount codes at checkout` | `utils/pricing.js`, `services/orderService.js`, `routes/orders.routes.js`, `server/test/discount.test.js` |
| 4 | `feat(cart): add discount store and show the discount in the kiosk cart` | `config/game.js`, `api/gameApi.js`, `utils/discount.js`, `utils/discount.test.js`, `discount/discountStore.js`, `hooks/useDiscount.js`, `hooks/useOrderCart.js`, `kiosk/CartPanel.jsx` |
| 5 | `feat(kiosk): add the Boba Spin wheel and dialog` | `kiosk/game/wheelGeometry.js`, `kiosk/game/wheelGeometry.test.js`, `kiosk/game/SpinWheel.jsx`, `kiosk/game/SpinDialog.jsx`, `kiosk/game/game.css` |
| 6 | `feat(kiosk): add the Boba Spin promotion to the home page` | `kiosk/home/PromoSection.jsx` |

## Jeremiah: Weather and chat assistant (6 commits)
Open-Meteo and Anthropic Claude, both behind server proxies. The Claude key never reaches the browser.

| # | Commit | Files |
|---|---|---|
| 1 | `feat(weather): add /api/weather using Open-Meteo with a short cache` | `settings/weather.js`, `utils/weatherMood.js`, `services/weatherService.js`, `routes/weather.routes.js`, `server/test/weather.test.js` |
| 2 | `feat(kiosk): add weather banner with weather-based drink picks` | `api/weatherApi.js`, `kiosk/home/WeatherSection.jsx`, `kiosk/weather.css` |
| 3 | `feat(api): add rate limiter and show deliberate error messages` | `middleware/rateLimit.js`, `middleware/errorHandler.js` |
| 4 | `feat(chat): add /api/chat assistant proxy with the live menu as context` | `settings/chat.js`, `utils/chatPrompt.js`, `services/chatService.js`, `routes/chat.routes.js`, `server/test/chat.test.js` |
| 5 | `feat(chat): add chat client, hook and one-tap cart line helper` | `config/chat.js`, `api/chatApi.js`, `hooks/useChat.js`, `utils/defaultLine.js`, `utils/defaultLine.test.js` |
| 6 | `feat(kiosk): add the menu assistant chat widget` | `kiosk/overlays/ChatOverlay.jsx`, `kiosk/chat.css` |

---

## Commit summary
Total 29 commits. Each person has at least four, and each has both client and server work.

| Member | Commits | Server | Client |
|---|---|---|---|
| Kavya | 6 | menu, quiz | explore storefront, drink pages, quiz |
| Allen | 5 | translate API and cache | DOM translator, language picker |
| Advaith | 6 | preferences API | accessibility theme, dialog, idle timer |
| Nikhil | 6 | game API, discount at checkout | wheel, cart discount, promo |
| Jeremiah | 6 | weather, chat, rate limit | weather banner, chat widget |

## How features plug into the kiosk
Kavya's `KioskView` loads whatever is in `providers/`, `toolbar/`, `home/` and `overlays/` (see `kioskSlots.jsx`). That is why every commit touches different files and can be made in any order without merge conflicts. Colors use the `--k-*` variables so high contrast reaches every feature.

## Demo script (10 minutes, deployed site only)
1. Open the Portal, then the Kiosk. Show the storefront home page, drink detail and Flavor Quiz. (Kavya)
2. Switch to Spanish, open a drink, turn on Simple words, then show the cached rows in the database. (Allen)
3. Open Accessibility: high contrast, larger text, larger buttons. Order a drink. (Advaith)
4. Spin the wheel, show the code applied in the cart, place the order, then show the discount in the Manager sales report. (Nikhil)
5. Show the weather banner and ask the assistant for a recommendation, then add its suggestion to the order. (Jeremiah)
6. Show the order on the Kitchen display and the inventory change. (Kavya)

Show the text of each completed backlog item as you demo it, and say what changed since Sprint 1.

## Definition of done
- Merged to `main`, deployed on Render, working in Chrome in landscape.
- `npm test` passes and `npm run build` succeeds.
- `GOOGLE_TRANSLATE_API_KEY` and `ANTHROPIC_API_KEY` set on Render.
- Each member has at least 4 commits (`git shortlog -sn`).
