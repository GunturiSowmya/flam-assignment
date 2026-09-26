export function validateStudyResult(result) {
  const fail = (message) => {
    throw new Error(message);
  };

  if (!result || typeof result !== "object" || Array.isArray(result)) {
    fail("The AI returned an unexpected response. Please try again.");
  }
  if (typeof result.title !== "string" || !result.title.trim()) {
    fail("The generated study material is missing a title. Please try again.");
  }
  if (!Array.isArray(result.cards)) {
    fail("The generated study material is missing flashcards. Please try again.");
  }
  if (result.cards.length === 0) {
    fail("No flashcards were generated. Please try again.");
  }
  if (!Array.isArray(result.quiz)) {
    fail("The generated study material is missing a quiz. Please try again.");
  }
  if (result.quiz.length === 0) {
    fail("No quiz questions were generated. Please try again.");
  }

  result.cards.forEach((card) => {
    if (
      !card || !Number.isFinite(card.id) ||
      typeof card.question !== "string" || !card.question.trim() ||
      typeof card.answer !== "string" || !card.answer.trim()
    ) {
      fail("A generated flashcard is incomplete. Please try again.");
    }
  });

  result.quiz.forEach((item) => {
    if (
      !item || !Number.isFinite(item.id) ||
      typeof item.question !== "string" || !item.question.trim()
    ) {
      fail("A generated quiz question is incomplete. Please try again.");
    }
    if (
      !Array.isArray(item.options) || item.options.length !== 4 ||
      item.options.some((option) => typeof option !== "string" || !option.trim())
    ) {
      fail("A quiz question must have exactly four answer options. Please try again.");
    }
    if (
      !Number.isInteger(item.correctAnswer) ||
      item.correctAnswer < 0 || item.correctAnswer >= item.options.length
    ) {
      fail("A quiz question has an invalid correct answer. Please try again.");
    }
  });

  return result;
}
