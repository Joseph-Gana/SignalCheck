import { z } from 'zod';

const evidenceFinding = z.object({
  title: z.string().min(1),
  explanation: z.string().min(1),
  evidence: z.string().min(1)
});

export const analysisSchema = z.object({
  facts: z.array(evidenceFinding),
  ambiguities: z.array(evidenceFinding),
  informationNotStated: z.array(
    z.object({ title: z.string().min(1), explanation: z.string().min(1) })
  ),
  questionsToAsk: z.array(z.object({ question: z.string().min(1) }))
});

export const analysisJsonSchema = {
  type: 'object',
  properties: {
    facts: { type: 'array', items: evidenceFindingSchema() },
    ambiguities: { type: 'array', items: evidenceFindingSchema() },
    informationNotStated: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          explanation: { type: 'string' }
        },
        required: ['title', 'explanation']
      }
    },
    questionsToAsk: {
      type: 'array',
      items: {
        type: 'object',
        properties: { question: { type: 'string' } },
        required: ['question']
      }
    }
  },
  required: ['facts', 'ambiguities', 'informationNotStated', 'questionsToAsk']
};

function evidenceFindingSchema() {
  return {
    type: 'object',
    properties: {
      title: { type: 'string' },
      explanation: { type: 'string' },
      evidence: { type: 'string' }
    },
    required: ['title', 'explanation', 'evidence']
  };
}
