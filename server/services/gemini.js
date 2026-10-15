import { GoogleGenAI } from '@google/genai';
import { analysisJsonSchema } from '../schemas/analysis.js';
import { validateAnalysis } from '../validation/analysis.js';

const PRIMARY_MODEL = 'gemini-3.5-flash-lite';
const FALLBACK_MODEL = 'gemini-2.5-flash-lite';

export async function analyzeText(sourceText) {
  if (!process.env.GEMINI_API_KEY) {
    const error = new Error('Gemini API key is not configured.');
    error.code = 'CONFIGURATION';
    throw error;
  }

  const client = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
  });

  const maxAttempts = 3;
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await requestAnalysis(
        client,
        PRIMARY_MODEL,
        sourceText
      );
    } catch (error) {
      lastError = error;

      logGeminiFailure('Gemini analysis attempt failed.', error, { attempt, maxAttempts });

      if (error?.code === 'CONFIGURATION') {
        throw error;
      }

      /*
       * INVALID_ANALYSIS is intentionally retried.
       *
       * Gemini can occasionally return valid-looking structured output
       * whose evidence does not exactly match the supplied source text.
       * We must keep the strict validator, but give the model another
       * opportunity to produce valid evidence.
       */
      if (error?.code === 'INVALID_ANALYSIS') {
        if (attempt < maxAttempts) {
          const delay = attempt * 1000;

          console.log(
            `Analysis validation failed. Retrying in ${delay / 1000} second(s)...`
          );

          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        throw lastError;
      }

      /*
       * If the primary model is unavailable, try the fallback model.
       */
      if (isModelUnavailable(error)) {
        console.warn('Primary Gemini model unavailable; trying fallback model.', {
          primaryModel: PRIMARY_MODEL,
          fallbackModel: FALLBACK_MODEL
        });

        try {
          return await requestAnalysis(
            client,
            FALLBACK_MODEL,
            sourceText
          );
        } catch (fallbackError) {
          lastError = fallbackError;

          /*
           * If the fallback also returns invalid analysis,
           * allow the normal retry loop to continue.
           */
          if (fallbackError?.code === 'INVALID_ANALYSIS') {
            if (attempt < maxAttempts) {
              const delay = attempt * 1000;

              console.log(
                `Fallback analysis validation failed. Retrying in ${delay / 1000} second(s)...`
              );

              await new Promise(resolve =>
                setTimeout(resolve, delay)
              );

              continue;
            }
          }
        }
      }

      /*
       * Retry transient API/network failures.
       */
      if (attempt < maxAttempts) {
        const delay = attempt * 1000;

        console.log(
          `Retrying Gemini request in ${delay / 1000} second(s)...`
        );

        await new Promise(resolve =>
          setTimeout(resolve, delay)
        );
      }
    }
  }

  throw lastError;
}

async function requestAnalysis(client, model, sourceText) {
  const interaction = await client.interactions.create({
    model,
    input: buildPrompt(sourceText),
    response_format: {
      type: 'text',
      mime_type: 'application/json',
      schema: analysisJsonSchema
    }
  });

  let candidate;

  try {
    candidate = JSON.parse(interaction.output_text);
  } catch {
    const error = new Error(
      'Gemini did not return usable structured analysis.'
    );

    error.code = 'INVALID_ANALYSIS';

    throw error;
  }

  try {
    return validateAnalysis(candidate, sourceText);
  } catch (validationError) {
    console.warn('SignalCheck analysis validation failed.');

    const error = new Error(
      'SignalCheck could not safely validate the analysis evidence.'
    );

    error.code = 'INVALID_ANALYSIS';

    throw error;
  }
}

function logGeminiFailure(message, error, context) {
  console.error(message, {
    ...context,
    status: error?.status ?? null,
    code: error?.code ?? null,
    name: error?.name ?? 'Error'
  });
}

function isModelUnavailable(error) {
  const message = String(error?.message ?? '').toLowerCase();

  return (
    error?.status === 404 ||
    message.includes('model not found') ||
    message.includes('model unavailable')
  );
}

function buildPrompt(sourceText) {
  return `You are SignalCheck, an evidence-first reading aid. Analyze only the supplied text.

Return the required JSON shape. Facts must be explicitly stated in the source and every fact must include an exact, contiguous quote copied character-for-character from the supplied text. Ambiguities must identify unclear wording or conditions and include an exact, contiguous quote copied character-for-character from the supplied text. Evidence is not a paraphrase: do not change, rewrite, summarize, inflect, normalize, or otherwise modify any words. Copy the evidence directly from the supplied text. Information Not Stated must only identify information absent from the supplied text; never say that missing information necessarily should exist and never provide an evidence quote for it. Questions to Ask must be practical follow-ups based on ambiguities or information not stated.

Never recommend accepting, rejecting, or deciding. Never call the text a scam. Do not present inference as a fact.

Supplied text:
---
${sourceText}
---`;
}
