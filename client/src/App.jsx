import { useRef, useState } from "react";
import PromptInput from "./components/PromptInput.jsx";
import ResultView from "./components/ResultView.jsx";
import { generateStudyMaterial } from "./lib/api.js";
import { validateStudyResult } from "./lib/validateResult.js";
import ErrorState from "./components/ErrorState.jsx";
import LoadingState from "./components/LoadingState.jsx";
import "./App.css";

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastPrompt, setLastPrompt] = useState("");
  const [resultVersion, setResultVersion] = useState(0);
  const latestRequest = useRef(0);

  async function handleGenerate(prompt) {
    if (!prompt.trim()) {
      setError("Please enter a topic or notes to get started.");
      return;
    }
    const id = ++latestRequest.current;
    setLastPrompt(prompt.trim());
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const generated = await generateStudyMaterial(prompt);
      if (id !== latestRequest.current) return;

      const validated = validateStudyResult(generated);
      setResult(validated);
      setResultVersion(id);
    } catch (requestError) {
      if (id === latestRequest.current) {
        setError(requestError.message || "Something went wrong while generating your study material.");
      }
    } finally {
      if (id === latestRequest.current) setLoading(false);
    }
  }

  return (
    <main className="home-page">
      <section className="hero">
        <p className="eyebrow">AI STUDY ASSISTANT</p>
        <h1>Learn anything.<br /><span>Study smarter.</span></h1>
        <p className="subtitle">Enter a topic or paste your notes, and turn them into interactive flashcards and quizzes.</p>
        <PromptInput onGenerate={handleGenerate} loading={loading} />
        {loading && <LoadingState />}
        {error && <ErrorState message={error} onRetry={() => handleGenerate(lastPrompt)} />}
      </section>
      {result && <ResultView key={resultVersion} result={result} />}
    </main>
  );
}

export default App;
