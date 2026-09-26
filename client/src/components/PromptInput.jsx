import { useState } from "react";

function PromptInput({ onGenerate, loading }) {
  const [prompt, setPrompt] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (!loading && prompt.trim()) onGenerate(prompt.trim());
  }

  return (
    <form className="prompt-input-wrap" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="study-prompt">Study prompt</label>
      <textarea id="study-prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Enter a topic or paste your notes..." />
      <div className="prompt-actions">
        <button type="submit" disabled={loading || !prompt.trim()}>{loading ? "Generating..." : "Generate"}</button>
      </div>
    </form>
  );
}

export default PromptInput;
