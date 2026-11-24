import { fetchFeatured } from '../../api/kioskApi';
import { ErrorMessage, Loading } from '../../components/StatusMessage';
import { STORE_INFO } from '../../config/storeInfo';
import { useAllergenFilter } from '../../hooks/useAllergenFilter';
import { useApi } from '../../hooks/useApi';
import DrinkArt from './DrinkArt';
import DrinkCard from './DrinkCard';
import SiteFooter from './SiteFooter';
import { homeSections } from './kioskSlots';

// Home page: hero, categories, feature sections from teammates, best sellers and the quiz.
export default function ExploreScreen({ categories, slotProps, onBrowse, onQuiz, onSelectProduct }) {
  const featured = useApi(fetchFeatured);
  const { filter } = useAllergenFilter();

  return (
    <div className="home">
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero__copy">
          <p className="eyebrow eyebrow--light">Reveille Brew Co.</p>
          <h1 id="hero-heading" className="hero__title">{STORE_INFO.TAGLINE}</h1>
          <p className="hero__text">{STORE_INFO.INTRO}</p>
          <div className="kiosk__actions">
            <button type="button" className="big-btn big-btn--accent" onClick={() => onBrowse()}>Order now</button>
            <button type="button" className="big-btn big-btn--ghost" onClick={onQuiz}>Take the flavor quiz</button>
          </div>
        </div>
        <DrinkArt category="Milk Tea" className="hero__art" />
      </section>

      <section className="section" aria-labelledby="categories-heading">
        <h2 id="categories-heading" className="section__title">Shop by flavor</h2>
        <ul className="category-grid">
          {categories.map((category) => (
            <li key={category}>
              <button type="button" className="category-tile" onClick={() => onBrowse(category)}>
                <DrinkArt category={category} className="category-tile__art" />
                <span className="category-tile__name">{category}</span>
                <span className="category-tile__blurb">{STORE_INFO.CATEGORY_BLURBS[category]}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {homeSections.map(({ key, Component }) => <Component key={key} {...slotProps} />)}

      <section className="section" aria-labelledby="featured-heading">
        <h2 id="featured-heading" className="section__title">Fan favorites</h2>
        {featured.error && <ErrorMessage error={featured.error} onRetry={featured.reload} />}
        {featured.loading && <Loading />}
        {featured.data && (
          <ul className="drink-grid">
            {filter(featured.data).map((product) => (
              <li key={product.productId}><DrinkCard product={product} onSelect={onSelectProduct} /></li>
            ))}
          </ul>
        )}
      </section>

      <section className="band" aria-labelledby="quiz-band-heading">
        <h2 id="quiz-band-heading" className="band__title">Not sure what to get?</h2>
        <p>Answer three quick questions and we will pick drinks for you.</p>
        <button type="button" className="big-btn big-btn--accent" onClick={onQuiz}>Find my drink</button>
      </section>

      <SiteFooter />
    </div>
  );
}
