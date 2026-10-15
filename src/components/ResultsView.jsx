import FindingCard from './FindingCard.jsx';

const sections = [
  [
    'Facts',
    'facts',
    'What the supplied text explicitly states.'
  ],
  [
    'Ambiguities',
    'ambiguities',
    'What remains unclear or open to interpretation.'
  ],
  [
    'Information Not Stated',
    'informationNotStated',
    'Relevant details the supplied text does not provide.'
  ],
  [
    'Questions to Ask',
    'questionsToAsk',
    'Follow-up questions that may help clarify the situation.'
  ]
];

export default function ResultsView({ result, onReset }) {
  return (
    <main className="page-shell">
      <section className="results-panel">
        <button
          className="text-button back-button"
          type="button"
          onClick={onReset}
        >
          Analyze another
        </button>

        <p className="eyebrow">SignalCheck analysis</p>

        <h1>What the text establishes—and what to investigate.</h1>

        <p className="source-intro">
          The supplied text is the source of truth. Use the findings below
          to understand what is stated, what is unclear, and what may need
          follow-up.
        </p>

        <div className="results-divider" />

        {sections.map(([label, key, description]) => (
          <section className="result-section" key={key}>
            <div className="section-heading">
              <h2>{label}</h2>
              <p>{description}</p>
            </div>

            {result.analysis[key].length ? (
              result.analysis[key].map((finding, index) => (
                <FindingCard
                  key={index}
                  finding={finding}
                  absence={key === 'informationNotStated'}
                />
              ))
            ) : (
              <p className="empty-category">
                No findings were returned in this category.
              </p>
            )}
          </section>
        ))}

        <details className="original-text">
          <summary>View original supplied text</summary>

          <div className="original-text-content">
            <p>{result.sourceText}</p>
          </div>
        </details>
      </section>
    </main>
  );
}