import { useState } from "react";
import QuizQuestion from "./QuizQuestion.jsx";

function Quiz({ quiz }) {
  const [activeQuiz, setActiveQuiz] = useState(quiz);
  const [index, setIndex] = useState(0);
  const [selection, setSelection] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [missedQuestions, setMissedQuestions] = useState([]);
  const [isRetest, setIsRetest] = useState(false);
  const complete = index >= activeQuiz.length;

  function submitAnswer() {
    if (selection === null || answered) return;
    if (selection === activeQuiz[index].correctAnswer) {
      setScore((current) => current + 1);
    } else {
      setMissedQuestions((current) => [...current, activeQuiz[index]]);
    }
    setAnswered(true);
  }

  function nextQuestion() {
    setIndex((current) => current + 1);
    setSelection(null);
    setAnswered(false);
  }

  function retestMissedQuestions() {
    setActiveQuiz(missedQuestions);
    setMissedQuestions([]);
    setIndex(0);
    setSelection(null);
    setAnswered(false);
    setScore(0);
    setIsRetest(true);
  }

  return (
    <div className="quiz-card">
      {complete ? (
        <div className="quiz-complete">
          <h3>{isRetest ? "Retest complete" : "Quiz complete"}</h3>
          <p>Score: {score} / {activeQuiz.length}</p>
          {missedQuestions.length > 0 ? (
            <button className="primary-button" type="button" onClick={retestMissedQuestions}>
              Retest {missedQuestions.length} missed {missedQuestions.length === 1 ? "question" : "questions"}
            </button>
          ) : isRetest ? (
            <p className="retest-success">You got all the retest questions right.</p>
          ) : null}
        </div>
      ) : (
        <QuizQuestion
            question={activeQuiz[index]}
            number={index + 1}
            total={activeQuiz.length}
            selection={selection}
            answered={answered}
            onSelect={setSelection}
            onSubmit={submitAnswer}
            onNext={nextQuestion}
            isLast={index === activeQuiz.length - 1}
          />
      )}
    </div>
  );
}

export default Quiz;
