import { useState } from "react";
import Flashcard from "./Flashcard.jsx";

function FlashcardDeck({ cards }) {
  const [index, setIndex] = useState(0);
  return (
    <div className="deck">
      <p className="item-count">Card {index + 1} of {cards.length}</p>
      <Flashcard key={`${index}-${cards[index].id}`} card={cards[index]} />
      <div className="deck-controls">
        <button type="button" onClick={() => setIndex((current) => Math.max(0, current - 1))} disabled={index === 0}>Previous</button>
        <button type="button" onClick={() => setIndex((current) => Math.min(cards.length - 1, current + 1))} disabled={index === cards.length - 1}>Next</button>
      </div>
    </div>
  );
}

export default FlashcardDeck;
