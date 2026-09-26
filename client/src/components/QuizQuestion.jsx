function QuizQuestion({ question, number, total, selection, answered, onSelect, onSubmit, onNext, isLast }) {
  const correct = answered && selection === question.correctAnswer;

  return (
    <div className="quiz-question">
      <p className="item-count">Question {number} of {total}</p>
      <h3>{question.question}</h3>
      <fieldset className="quiz-options" disabled={answered}>
        <legend className="sr-only">Choose an answer</legend>
        {question.options.map((option, optionIndex) => (
          <label
            className={`quiz-option${answered && optionIndex === question.correctAnswer ? " is-correct" : ""}${answered && selection === optionIndex && !correct ? " is-incorrect" : ""}`}
            key={`${question.id}-${optionIndex}`}
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              value={optionIndex}
              checked={selection === optionIndex}
              onChange={() => onSelect(optionIndex)}
            />
            <span>{option}</span>
          </label>
        ))}
      </fieldset>
      {answered && (
        <p className={`answer-feedback ${correct ? "correct" : "incorrect"}`} role="status">
          {correct ? "Correct!" : "Not quite. The correct answer is highlighted."}
        </p>
      )}
      {answered ? (
        <button className="primary-button" type="button" onClick={onNext}>{isLast ? "See results" : "Next question"}</button>
      ) : (
        <button className="primary-button" type="button" onClick={onSubmit} disabled={selection === null}>Submit answer</button>
      )}
    </div>
  );
}

export default QuizQuestion;
