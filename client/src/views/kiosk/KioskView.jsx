import { useCallback, useRef, useState } from 'react';
import { fetchMenu } from '../../api/menuApi';
import { fetchOptions } from '../../api/optionsApi';
import { ErrorMessage, Loading } from '../../components/StatusMessage';
import { ALL_DRINKS } from '../../config/storeInfo';
import { useApi } from '../../hooks/useApi';
import { useIdleReset } from '../../hooks/useIdleReset';
import { useOrderCart } from '../../hooks/useOrderCart';
import CartPanel from './CartPanel';
import ConfirmationScreen from './ConfirmationScreen';
import CustomizeScreen from './CustomizeScreen';
import DrinkBrowser from './DrinkBrowser';
import DrinkDetail from './DrinkDetail';
import ExploreScreen from './ExploreScreen';
import FlavorQuiz from './FlavorQuiz';
import SiteHeader from './SiteHeader';
import WelcomeScreen from './WelcomeScreen';
import { overlays, wrapWithProviders } from './kioskSlots';
import './kiosk.css';

const ORDER_SOURCE = 'kiosk';
const IDLE_TIMEOUT_MS = 90_000;
const CONFIRMATION_TIMEOUT_MS = 20_000;
const SCREENS = {
  WELCOME: 'welcome', HOME: 'home', MENU: 'menu', QUIZ: 'quiz', DETAIL: 'detail', CUSTOMIZE: 'customize', DONE: 'done',
};

function KioskContent() {
  const menu = useApi(fetchMenu);
  const options = useApi(fetchOptions);
  const cart = useOrderCart(ORDER_SOURCE);
  const cartRef = useRef(null);

  const [screen, setScreen] = useState(SCREENS.WELCOME);
  const [category, setCategory] = useState(ALL_DRINKS);
  const [selected, setSelected] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const reset = useCallback(() => {
    cart.clear();
    setSelected(null);
    setError(null);
    setCategory(ALL_DRINKS);
    setScreen(SCREENS.WELCOME);
  }, [cart.clear]); // eslint-disable-line react-hooks/exhaustive-deps

  const onConfirmation = screen === SCREENS.DONE;
  useIdleReset(screen !== SCREENS.WELCOME, onConfirmation ? CONFIRMATION_TIMEOUT_MS : IDLE_TIMEOUT_MS, reset);

  const content = (body) => (
    <div className="kiosk">
      <a className="skip-link" href="#main">Skip to main content</a>
      <SiteHeader screen={screen} cartCount={cart.itemCount}
                  onNavigate={setScreen} onViewCart={() => cartRef.current?.scrollIntoView({ behavior: 'smooth' })} />
      {body}
    </div>
  );

  if (menu.error || options.error) {
    return content(<main className="kiosk__main" id="main"><ErrorMessage error={menu.error ?? options.error}
      onRetry={() => { menu.reload(); options.reload(); }} /></main>);
  }
  if (menu.loading || options.loading) return content(<main className="kiosk__main" id="main"><Loading /></main>);

  const openDrink = (product) => { setSelected(product); setScreen(SCREENS.DETAIL); };
  const browse = (nextCategory = ALL_DRINKS) => { setCategory(nextCategory); setScreen(SCREENS.MENU); };
  const slotProps = { products: menu.data, options: options.data, cart, onSelectProduct: openDrink };

  async function handleCheckout() {
    setSubmitting(true);
    setError(null);
    try {
      const result = await cart.checkout();
      setOrderId(result.orderId);
      setScreen(SCREENS.DONE);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (screen === SCREENS.WELCOME) {
    return content(<main id="main" className="kiosk__welcome"><WelcomeScreen onStart={() => setScreen(SCREENS.HOME)} /></main>);
  }

  return content(
    <>
      <main className="kiosk__main" id="main">
        {screen === SCREENS.HOME && (
          <ExploreScreen categories={options.data.categories} slotProps={slotProps}
                         onBrowse={browse} onQuiz={() => setScreen(SCREENS.QUIZ)} onSelectProduct={openDrink} />
        )}
        {screen === SCREENS.MENU && (
          <DrinkBrowser products={menu.data} categories={options.data.categories} activeCategory={category}
                        onCategoryChange={setCategory} onSelect={openDrink} />
        )}
        {screen === SCREENS.QUIZ && (
          <FlavorQuiz products={menu.data} onSelectProduct={openDrink} onBack={() => browse()} />
        )}
        {screen === SCREENS.DETAIL && (
          <DrinkDetail key={selected.productId} product={selected} onBack={() => browse(category)}
                       onCustomize={(drink) => { setSelected(drink); setScreen(SCREENS.CUSTOMIZE); }} />
        )}
        {screen === SCREENS.CUSTOMIZE && (
          <CustomizeScreen key={selected.productId} product={selected} options={options.data}
                           onBack={() => setScreen(SCREENS.DETAIL)}
                           onAdd={(line) => { cart.addLine(line); browse(category); }} />
        )}
        {screen === SCREENS.DONE && <ConfirmationScreen orderId={orderId} onDone={reset} />}
      </main>
      {screen !== SCREENS.DONE && cart.lines.length > 0 && (
        <div ref={cartRef}><CartPanel cart={cart} submitting={submitting} error={error} onCheckout={handleCheckout} /></div>
      )}
      {overlays.map(({ key, Component }) => <Component key={key} {...slotProps} />)}
    </>,
  );
}

export default function KioskView() {
  return wrapWithProviders(<KioskContent />);
}
