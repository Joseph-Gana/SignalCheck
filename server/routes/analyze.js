import { Router } from 'express';
import { analyzeText } from '../services/gemini.js';

const MIN_TEXT_LENGTH = 80;
const MAX_TEXT_LENGTH = 12000;

export const analyzeRouter = Router();

analyzeRouter.post('/', async (request, response) => {
  const text =
    typeof request.body?.text === 'string'
      ? request.body.text.trim()
      : '';

  const inputError = getInputError(text);

  if (inputError) {
    return response.status(400).json({
      error: inputError
    });
  }

  try {
    const analysis = await analyzeText(text);

    return response.json({
      sourceText: text,
      analysis
    });
  } catch (error) {
    if (error.code === 'CONFIGURATION') {
      return response.status(503).json({
        error:
          'SignalCheck is not ready to analyze text yet. Please try again later.'
      });
    }

    if (error.code === 'INVALID_ANALYSIS') {
      return response.status(502).json({
        error:
          'We could not safely validate this analysis. Please try again.'
      });
    }

    const status = error?.status === 429 ? 429 : 502;

    return response.status(status).json({
      error: 'We couldn’t analyze this text. Please try again.'
    });
  }
});

export function getInputError(text) {
  if (!text) {
    return 'Paste some text to analyze.';
  }

  if (text.length < MIN_TEXT_LENGTH) {
    return 'Add more detail so SignalCheck can identify facts, ambiguities, and information not stated.';
  }

  if (text.length > MAX_TEXT_LENGTH) {
    return 'This text is too long. Please shorten it to 12,000 characters or less.';
  }

  return null;
}