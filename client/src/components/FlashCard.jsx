import { useState } from "react";

function Flashcard({ card }) {
  const [showAnswer, setShowAnswer] = useState(false);
  return (
    <button className="flashcard" type="button" onClick={() => setShowAnswer((shown) => !shown)} aria-label={showAnswer ? "Show question" : "Reveal answer"}>
      <span className="flashcard-label">{showAnswer ? "ANSWER" : "QUESTION"}</span>
      <span className="flashcard-text">{showAnswer ? card.answer : card.question}</span>
      <span className="flashcard-hint">Click to {showAnswer ? "see the question" : "reveal the answer"}</span>
    </button>
  );
}

export default Flashcard;
