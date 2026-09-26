import FlashcardDeck from "./FlashcardDeck.jsx";
import Quiz from "./Quiz.jsx";

function ResultView({ result }) {
  return (
    <section className="results" aria-label="Generated study material">
      <h2 className="result-title">{result.title}</h2>
      <section className="result-section"><h2>Flashcards</h2><FlashcardDeck cards={result.cards} /></section>
      <section className="result-section"><h2>Quiz</h2><Quiz quiz={result.quiz} /></section>
    </section>
  );
}

export default ResultView;
