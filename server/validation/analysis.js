import { analysisSchema } from '../schemas/analysis.js';

export function validateAnalysis(candidate, sourceText) {
  const analysis = analysisSchema.parse(candidate);

  const evidenceFindings = [
    ...analysis.facts.map(finding => ({ category: 'fact', finding })),
    ...analysis.ambiguities.map(finding => ({ category: 'ambiguity', finding }))
  ];

  for (const { category, finding } of evidenceFindings) {
    if (!sourceText.includes(finding.evidence)) {
      console.warn('Evidence validation rejected an analysis finding.', {
        category
      });

      throw new Error(
        'The model returned evidence that does not exactly match the supplied text.'
      );
    }
  }

  return analysis;
}
