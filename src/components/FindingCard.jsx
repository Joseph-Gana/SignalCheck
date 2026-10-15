import { useState } from 'react';

export default function FindingCard({ finding, absence }) {
  const [isEvidenceVisible, setEvidenceVisible] = useState(false);

  return (
    <article className="finding-card">
      <h3>{finding.title ?? finding.question}</h3>

      {finding.explanation && (
        <p className="finding-explanation">
          {finding.explanation}
        </p>
      )}

      {absence && (
        <p className="absence-note">
          This reflects information not stated in the supplied text,
          not a claim that it must exist.
        </p>
      )}

      {finding.evidence && (
        <div className="evidence-area">
          <button
            className="text-button evidence-button"
            type="button"
            onClick={() => setEvidenceVisible(!isEvidenceVisible)}
            aria-expanded={isEvidenceVisible}
          >
            {isEvidenceVisible ? 'Hide evidence' : 'View evidence'}
          </button>

          {isEvidenceVisible && (
            <div className="source-passage">
              <strong>Source passage</strong>
              <p>{finding.evidence}</p>
            </div>
          )}
        </div>
      )}
    </article>
  );
}