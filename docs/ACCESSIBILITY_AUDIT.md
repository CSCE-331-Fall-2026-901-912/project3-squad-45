# Accessibility audit: Customer Kiosk

Personas supported (team of 5 needs three): **Maria** (translation, clear wording), **Vishnu** (low vision: magnification and contrast), **Carol** (large text, hand tremor).

The "Built" column says what the code does. The "Result" column is **empty on purpose**: fill it in only after you have actually run the check, with the date and who ran it.

## Persona features
| Persona | Need | Feature | Where | WCAG 2.1 |
|---|---|---|---|---|
| Maria | Reads in Spanish, needs clear writing | Language picker (5 languages), cached Google Translate, boba glossary, brand names kept | `client/src/i18n/`, `/api/translate` | 3.1.1 Language of Page, 3.1.2 Language of Parts |
| Maria | Clearly written information | "Simple words" mode swaps in short sentences on drink pages | `DrinkDetail.jsx` (`data-plain-text`), `DomTranslator.js` | 3.1.5 Reading Level |
| Vishnu | Contrast adjustment | High contrast theme, black and yellow | `styles/accessibility.css` | 1.4.3 Contrast, 1.4.6 Enhanced Contrast |
| Vishnu | Magnification | Four text sizes; layout wraps instead of clipping | `config/accessibility.js` | 1.4.4 Resize Text, 1.4.10 Reflow |
| Carol | Enlarged text | Same text size control | `AccessibilityTool.jsx` | 1.4.4 |
| Carol | Hand tremor | "Larger buttons" (88 px, wider gaps), no drag or hold gestures, no timers in the game | `accessibility.css` | 2.5.5 Target Size, 2.5.1 Pointer Gestures |
| Carol | Needs time | "More time" triples the idle timeout; timer pauses on dialogs | `useIdleReset.js` | 2.2.1 Timing Adjustable |
| All | Motion | Reduced motion follows the system setting and a toggle | `accessibility.css`, `SpinDialog.jsx` | 2.3.3 Animation from Interactions |

## Built in for everyone
| Item | Where | WCAG 2.1 |
|---|---|---|
| Skip link, landmarks (`header`, `nav`, `main`, `footer`), one `h1` per screen | `KioskView.jsx`, `SiteHeader.jsx` | 2.4.1, 1.3.1 |
| Focus moves to the new screen's heading | `DrinkDetail.jsx`, `FlavorQuiz.jsx` | 2.4.3 |
| Modal dialogs use native `<dialog>` (focus trap, Escape, focus return) | `AccessibilityTool.jsx`, `SpinDialog.jsx` | 2.1.2, 2.4.3 |
| Visible focus ring | `theme.css`, high contrast override | 2.4.7 |
| Status messages announced (`role="status"`, `aria-live`) | cart, game result, chat | 4.1.3 |
| Decorative cup art hidden from screen readers | `DrinkArt.jsx` | 1.1.1 |
| Game can be skipped, has no timer, result is also text | `SpinDialog.jsx` | 2.1.1, 2.2.1 |
| Screen reader labels are translated too (`aria-label`, `placeholder`, `title`, `alt`) | `DomTranslator.js` | 3.1.1 |

## Checks to run before the demo
| # | Check | How | Result |
|---|---|---|---|
| 1 | Lighthouse accessibility score on `/kiosk` (normal and high contrast) | Chrome DevTools, Lighthouse tab | |
| 2 | axe DevTools scan on home, menu, drink detail, quiz and cart | axe extension | |
| 3 | Keyboard only: reach and operate every control, open and close both dialogs | Tab, Shift+Tab, Enter, Space, Escape | |
| 4 | Screen reader pass through ordering a drink | VoiceOver (Cmd+F5) | |
| 5 | 200 percent browser zoom plus "Largest" text: nothing clipped, no sideways scroll | Cmd and + | |
| 6 | Contrast of text in high contrast and normal themes | DevTools color picker, or WebAIM contrast checker | |
| 7 | Language set to Spanish: no English left on the main flow (note anything the API missed) | Switch language and walk the flow | |
| 8 | Wheel with "Reduce motion" on lands instantly | Accessibility dialog | |

## Known gaps
- Translation and chat need API keys on Render. Without them the kiosk shows "Some text is not translated" or "assistant unavailable" instead of failing.
- The static Spanish dictionary covers interface text. Other languages use the API only.
- Chat replies are not read aloud.
