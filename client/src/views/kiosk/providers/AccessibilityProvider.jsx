import { AccessibilityContext, useAccessibilitySettings } from '../../../hooks/useAccessibility';
import '../../../styles/accessibility.css';

// Picked up by kioskSlots: applies and shares the visitor's accessibility settings.
export default function AccessibilityProvider({ children }) {
  const value = useAccessibilitySettings();
  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}
