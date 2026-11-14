import { useEffect, useRef, useState } from 'react';
import { fetchQuiz, recommendDrinks } from '../../api/kioskApi';
import { ErrorMessage, Loading } from '../../components/StatusMessage';
import { useApi } from '../../hooks/useApi';
import DrinkCard from './DrinkCard';

export default function FlavorQuiz({ products, onSelectProduct, onBack }) {
  const quiz = useApi(fetchQuiz);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const headingRef = useRef(null);
  const step = Object.keys(answers).length;

  // Move focus to the heading whenever the question or result changes, for screen readers.
  useEffect(() => headingRef.current?.focus(), [step, results]);

  if (quiz.error) return <ErrorMessage error={quiz.error} onRetry={quiz.reload} />;
  if (quiz.loading) return <Loading />;
  const { questions } = quiz.data;

  async function choose(question, option) {
    const next = { ...answers, [question.id]: option.id };
    setAnswers(next);
    if (Object.keys(next).length < questions.length) return;
    try {
      const { drinks } = await recommendDrinks(next);
      const byId = new Map(products.map((product) => [product.productId, product]));
      setResults(drinks.map((drink) => byId.get(drink.productId) ?? drink));
    } catch (err) {
      setError(err);
      setAnswers({});
    }
  }

  function restart() {
    setAnswers({});
    setResults(null);
    setError(null);
  }

  if (results) {
    return (
      <section aria-labelledby="quiz-heading">
        <h1 id="quiz-heading" className="kiosk__heading" tabIndex={-1} ref={headingRef}>Your matches</h1>
        {results.length === 0
          ? <p className="empty">We could not find a match. Try different answers.</p>
          : <ul className="drink-grid">{results.map((product) => <li key={product.productId}><DrinkCard product={product} onSelect={onSelectProduct} /></li>)}</ul>}
        <div className="kiosk__actions">
          <button type="button" className="big-btn" onClick={restart}>Retake quiz</button>
          <button type="button" className="big-btn" onClick={onBack}>See the full menu</button>
        </div>
      </section>
    );
  }

  const question = questions[step];
  return (
    <section className="quiz" aria-labelledby="quiz-heading">
      <p className="eyebrow">Question {step + 1} of {questions.length}</p>
      <h1 id="quiz-heading" className="kiosk__heading" tabIndex={-1} ref={headingRef}>{question.text}</h1>
      {error && <ErrorMessage error={error} />}
      <div className="option-row">
        {question.options.map((option) => (
          <button key={option.id} type="button" className="option option--wide" onClick={() => choose(question, option)}>
            {option.label}
          </button>
        ))}
      </div>
      <div className="kiosk__actions">
        <button type="button" className="big-btn" onClick={step === 0 ? onBack : () => setAnswers(Object.fromEntries(Object.entries(answers).slice(0, -1)))}>
          Back
        </button>
      </div>
    </section>
  );
}
