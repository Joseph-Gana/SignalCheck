import { useState } from 'react';
import InputScreen from './components/InputScreen.jsx';
import ResultsView from './components/ResultsView.jsx';

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '');
const API_URL = `${
  configuredApiBaseUrl || (import.meta.env.DEV ? 'http://localhost:3001' : '')
}/api/analyze`;

const GENERIC_ERROR =
  'We couldn’t analyze this text. Please try again.';

async function readResponse(response) {
  const rawText = await response.text();

  if (!rawText.trim()) {
    throw new Error(GENERIC_ERROR);
  }

  try {
    return JSON.parse(rawText);
  } catch {
    throw new Error(GENERIC_ERROR);
  }
}

export default function App() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleAnalyze() {
    setError('');
    setResult(null);
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: inputText
        })
      });

      const payload = await readResponse(response);

      if (!response.ok) {
        throw new Error(
          payload?.error || GENERIC_ERROR
        );
      }

      if (!payload?.analysis || !payload?.sourceText) {
        throw new Error(GENERIC_ERROR);
      }

      setResult(payload);
    } catch (requestError) {
      console.error('Analysis request failed:', requestError);

      setError(
        requestError?.message || GENERIC_ERROR
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    setInputText('');
    setResult(null);
    setError('');
  }

  if (result) {
    return (
      <ResultsView
        result={result}
        onReset={handleReset}
      />
    );
  }

  return (
    <InputScreen
      text={inputText}
      onTextChange={setInputText}
      onAnalyze={handleAnalyze}
      isLoading={isLoading}
      error={error}
    />
  );
}
