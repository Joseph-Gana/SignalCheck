
const SAMPLE_TEXT = `We are pleased to offer you a six-month employment contract starting on November 2, 2026. Your monthly salary will be $3,500, payable at the end of each month. The position is based at our London office, and working hours are Monday to Friday, 9:00 AM to 5:00 PM. Your contract may be renewed depending on performance and management approval. You will be eligible for additional benefits as determined by company policy. Details regarding paid leave, probation, overtime compensation, and the specific benefits included in your package will be provided during onboarding. Please confirm your acceptance of this offer within five business days.`;

export default function InputScreen({
  text,
  onTextChange,
  onAnalyze,
  isLoading,
  error,
}) {
  const handleTrySample = () => {
    onTextChange(SAMPLE_TEXT);
  };

  return (
    <main className="page-shell">
      <section className="input-panel">
        <p className="eyebrow">SignalCheck</p>

        <h1>Understand before you decide.</h1>

        <p>
          Paste an important written offer or message below. SignalCheck will
          identify what is clear, what is ambiguous, what information is not
          stated, and what questions you may want to ask.
        </p>

        <label htmlFor="source-text">Message to analyze</label>

        <div className="sample-action">
          <button
            type="button"
            className="sample-button"
            onClick={handleTrySample}
            disabled={isLoading}
          >
            Try a Sample
          </button>
          <span>Load an example message to explore SignalCheck.</span>
        </div>

        <textarea
          id="source-text"
          value={text}
          onChange={(event) => onTextChange(event.target.value)}
          placeholder="Paste your offer, message, or announcement here…"
          disabled={isLoading}
        />

        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        <button type="button" onClick={onAnalyze} disabled={isLoading}>
          {isLoading ? "Analyzing…" : "Analyze"}
        </button>
      </section>
    </main>
  );
}
