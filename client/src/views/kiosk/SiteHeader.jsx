import { VENDOR_NAME } from '../../config/constants';
import { tools } from './kioskSlots';

const NAV_ITEMS = [
  { screen: 'home', label: 'Home' },
  { screen: 'menu', label: 'Menu' },
  { screen: 'quiz', label: 'Flavor Quiz' },
];

// Sticky site header: brand, main navigation, feature tools and the order count.
export default function SiteHeader({ screen, onNavigate, cartCount, onViewCart }) {
  return (
    <header className="site-header">
      <button type="button" className="site-header__brand" translate="no" onClick={() => onNavigate('home')}>
        {VENDOR_NAME}
      </button>
      <nav aria-label="Main" className="site-header__nav">
        {NAV_ITEMS.map((item) => (
          <button key={item.screen} type="button" className="nav-link"
                  aria-current={screen === item.screen ? 'page' : undefined}
                  onClick={() => onNavigate(item.screen)}>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="site-header__tools">
        {tools.map(({ key, Component }) => <Component key={key} />)}
        <button type="button" className="cart-pill" onClick={onViewCart}>
          Your order <span className="cart-pill__count" translate="no">{cartCount}</span>
        </button>
      </div>
    </header>
  );
}
