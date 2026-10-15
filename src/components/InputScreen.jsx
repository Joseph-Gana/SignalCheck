export default function InputScreen({ text, onTextChange, onAnalyze, isLoading, error }) {
  return <main className="page-shell">
    <section className="input-panel">
      <p className="eyebrow">SignalCheck</p>
      <h1>Understand before you decide.</h1>
      <p>Paste an important written offer or message below. SignalCheck will identify what is clear, what is ambiguous, what information is not stated, and what questions you may want to ask.</p>
      <label htmlFor="source-text">Message to analyze</label>
      <textarea
        id="source-text"
        value={text}
        onChange={(event) => onTextChange(event.target.value)}
        placeholder="Paste your offer, message, or announcement here…"
        disabled={isLoading}
      />
      {error && <p className="error-message" role="alert">{error}</p>}
      <button type="button" onClick={onAnalyze} disabled={isLoading}>
        {isLoading ? 'Analyzing…' : 'Analyze'}
      </button>
    </section>
  </main>;
}
