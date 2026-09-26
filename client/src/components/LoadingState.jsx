function LoadingState() {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <span className="loading-spinner" aria-hidden="true" />
      <div>
        <p className="loading-title">Building your study set</p>
        <p className="loading-description">Creating flashcards and quiz questions from your material…</p>
      </div>
    </div>
  );
}

export default LoadingState;
