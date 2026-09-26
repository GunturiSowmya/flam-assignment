function ErrorState({ message, onRetry }) {
  return (
    <div className="error-state" role="alert">
      <span className="error-state-icon" aria-hidden="true">!</span>
      <div className="error-state-copy">
        <h2>We couldn’t make your study set</h2>
        <p>{message}</p>
      </div>
      {onRetry && <button className="error-retry-button" type="button" onClick={onRetry}>Try again</button>}
    </div>
  );
}

export default ErrorState;
