---
doc: spec
status: approved
---

# SignalCheck — Technical Spec

## How This Works, In Plain Language

SignalCheck has two small pieces. The React browser app is the evidence reader: it accepts pasted text, shows loading and error states, and displays the four result categories. A tiny Express server is the locked door between that browser app and Gemini: it holds the API key, asks Gemini for structured findings, and refuses to return a quoted passage unless that exact passage appears in the person’s submitted text.

This split keeps the API key out of the browser without adding a database, authentication, or hosted infrastructure. React keeps one current analysis only in browser memory; the Express server keeps no user data after answering the request. Gemini returns JSON that fits the four UI sections, and the server performs a second, non-AI check on evidence before the UI ever sees it.

## The Core Journey Through the System

Implements `prd.md > The Core Journey`.

1. The person opens the Vite-served React page and sees `InputScreen`.
2. They paste text. `App` keeps that text in memory and `InputScreen` validates it locally: it must contain at least 80 characters and no more than 12,000 characters.
3. On **Analyze**, the browser sends `{ "text": "…" }` to the local Express endpoint `POST /api/analyze`. The UI disables the button and shows **Analyzing…**; it sends no duplicate request and shows no partial result.
4. `analyzeRoute` repeats the input checks, then `geminiService` asks the primary Gemini model for a JSON response matching `analysisSchema`.
5. `geminiService` uses `gemini-3.5-flash-lite` first. Only when that model is unavailable and Gemini cleanly supports the fallback does it retry once with `gemini-2.5-flash-lite`; model selection never appears in the UI.
6. `validateAnalysis` checks that the response matches the expected data shape and that every returned evidence string is an exact, case-sensitive substring of the submitted text. If any quoted evidence fails, the server returns a safe error rather than a partly trusted analysis.
7. The server returns the validated analysis plus the original text. `ResultsView` renders the four categories; `FindingCard` expands and collapses the source passage inline.
8. **Analyze another** clears the React memory and returns to the empty input screen. The server has no saved history to remove.

## Stack

- **JavaScript, React, and Vite** — a lightweight single-page browser interface for the small, local-first POC. React supplies component structure; Vite provides development serving and builds. No router, component library, or CSS framework is needed. [React](https://react.dev/), [Vite](https://vite.dev/guide/)
- **Plain CSS** — implements the calm editorial visual direction directly, without a design-system dependency.
- **Node.js and Express** — one small local server and `POST /api/analyze` endpoint. This preserves the learner’s requirement that the Gemini key never reach the browser. [Express](https://expressjs.com/)
- **`@google/genai`** — the official Google GenAI JavaScript SDK used only by the server. It sends the structured analysis request using `GEMINI_API_KEY` from the server environment. [Gemini API JavaScript SDK](https://ai.google.dev/gemini-api/docs/structured-output)
- **Zod** — defines and validates the expected analysis object on the server before response data reaches the UI. Gemini’s JavaScript documentation supports using Zod-defined schemas for structured output; application-level validation remains required. [Gemini Structured Outputs](https://ai.google.dev/gemini-api/docs/structured-output)
- **dotenv** — loads a local, ignored `.env` file for development. `GEMINI_API_KEY` is never placed in client code, committed, or returned by the API.

The initial implementation will install current compatible package versions using npm and record the resolved versions in `package-lock.json`; exact versions will be verified at install time rather than guessed in this plan.

## Where It Runs and How Someone Tries It

The app runs locally on the learner’s computer: Vite serves the browser client and a separate Node process runs Express. It requires a current Node.js LTS release and a Gemini API key available to the server as `GEMINI_API_KEY`.

1. Copy `.env.example` to `.env` and set `GEMINI_API_KEY` locally; do not commit `.env`.
2. Run `npm install` at the repository root.
3. Start the server with `npm run dev:server`.
4. In a second terminal, start Vite with `npm run dev:client`.
5. Open the local Vite URL shown in the terminal, paste the prepared offer, and record the complete demo flow.

The submission still needs a short demo video and public GitHub repository. Deployment is intentionally optional and is not needed to record the POC.

## Look and Feel

Implements `prd.md > Look and Feel`.

- Use white or off-white page backgrounds, deep navy or charcoal primary text, subtle neutral borders, and a restrained amber/gold highlight only for evidence.
- Use a readable modern sans-serif with strong hierarchy; headings may feel slightly editorial while body text remains highly legible.
- Use moderate whitespace, simple cards, gentle shadows, and vertical result sections that scan like a reading/research tool.
- Mark original source passages with a **Source passage** label and subtle amber highlight. AI findings and questions remain visually distinct from that source text.
- Avoid gradients, neon or purple/blue AI motifs, dense dashboard styling, chat bubbles, avatars, decorative AI imagery, and unnecessary animation.

## Components

### `App`

Owns the one in-memory screen state: input, current analysis, loading status, and a recoverable error message. It switches between the input and results views and clears everything for **Analyze another**.

Implements `prd.md > Screens and Layout`, `prd.md > Resetting the Analysis`.

### `InputScreen`

Renders SignalCheck’s name, tagline, explanatory copy, text area, input guidance, validation feedback, and the Analyze button. It keeps entered text editable after any validation or API error.

Before requesting the server, it blocks empty text, text shorter than 80 characters, and text longer than 12,000 characters. The maximum-length message is: **“This text is too long. Please shorten it to 12,000 characters or less.”**

Implements `prd.md > Input View`, `prd.md > Text Submission and Analysis`, `prd.md > States and Boundaries`.

### `ResultsView`

Renders the **Analyze another** control, makes the original supplied text accessible, and displays Facts, Ambiguities, Information Not Stated, and Questions to Ask in a vertical layout. It includes no verdict or recommendation.

Implements `prd.md > Results View`, `prd.md > Evidence-First Results`.

### `FindingCard`

Renders a concise title and explanation. For evidence-supported facts and ambiguities, it owns the inline **View evidence** / **Hide evidence** state and displays the exact validated passage below the finding. Information Not Stated cards display the absence-based explanation rather than a fabricated quote. Questions show the generated question directly.

Implements `prd.md > Inline Evidence Reveal`.

### `analyzeRoute`

Receives `POST /api/analyze`, validates the JSON body and input length again on the server, invokes `geminiService`, maps known failures to safe API responses, and never logs or returns the API key.

Implements `prd.md > Text Submission and Analysis`, `prd.md > States and Boundaries`.

### `geminiService`

Builds the analysis instruction and JSON schema, calls Gemini, applies the agreed primary/fallback model sequence, parses the JSON response, and passes it to `validateAnalysis`.

The instruction explicitly requires: facts must be explicit source statements; ambiguities must not be restated as facts; Information Not Stated must describe only absence from the supplied text; questions must be practical follow-ups; no accept/reject/scam verdicts; and evidence must quote exact supplied text.

Implements `prd.md > Evidence-First Results`.

### `validateAnalysis`

Uses the Zod schema for shape checking, then enforces the product’s central integrity rule: every non-empty `evidence` value must occur exactly in the submitted text. It returns only a complete validated analysis or a safe validation failure; it does not silently repair or invent evidence.

Implements `prd.md > Evidence-First Results`, `prd.md > Inline Evidence Reveal`.

## Data Model

There is no database and no persistent data. All client data is cleared by **Analyze another** or a browser refresh.

```js
// Client-only, in-memory values
inputText: string
status: 'input' | 'loading' | 'results' | 'error'
errorMessage: string | null
analysis: Analysis | null

// Validated server response
Analysis = {
  facts: [{ title: string, explanation: string, evidence: string }],
  ambiguities: [{ title: string, explanation: string, evidence: string }],
  informationNotStated: [{ title: string, explanation: string }],
  questionsToAsk: [{ question: string }]
}
```

`inputText` originates with the user and is sent only for the current request. `analysis` originates with Gemini but is usable only after server validation. The original text is returned alongside the analysis for results review; it is not stored after the request or browser session.

## File Structure

```
SignalCheck/
├── devpost/                    # Canonical learning documents
├── public/                     # Static Vite assets, if needed
├── server/
│   ├── index.js                # Express setup and local server entry point
│   ├── routes/analyze.js        # POST /api/analyze request and error handling
│   ├── services/gemini.js       # Gemini request, primary/fallback model handling
│   ├── validation/analysis.js   # Zod shape and exact-substring evidence checks
│   └── schemas/analysis.js      # Shared Gemini JSON schema and Zod schema
├── src/
│   ├── App.jsx                 # One-analysis UI state and screen switching
│   ├── main.jsx                # React entry point
│   ├── components/
│   │   ├── InputScreen.jsx      # Paste and validation experience
│   │   ├── ResultsView.jsx      # Four result sections and original-text access
│   │   └── FindingCard.jsx      # Inline evidence reveal
│   └── styles.css               # Editorial evidence-reader styles
├── .env.example                # GEMINI_API_KEY placeholder only
├── .gitignore                  # Excludes .env and learner profile
├── index.html                  # Vite HTML entry
├── package.json                # Scripts and dependency declarations
├── package-lock.json           # Resolved dependency versions
├── vite.config.js              # Dev-server proxy for /api to Express
└── README.md                   # Setup, run, demo, and safety notes
```

## External Services and Dependencies

### Gemini Developer API

- **Purpose:** produce the one-time, structured analysis.
- **Server call:** Google GenAI SDK call with `model`, a text prompt containing the supplied text, and a JSON response schema. The response must contain the four category arrays described in `Data Model`.
- **Primary model:** `gemini-3.5-flash-lite`, selected because Google recommends it for new projects and lists its Free-tier input and output tokens as free of charge. [Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing)
- **Fallback model:** `gemini-2.5-flash-lite`, attempted once only after a primary-model-unavailable error and only when the API indicates the fallback can be used. No fallback occurs for validation failures, rate limits, or generic service failures. Google lists it as available but limits 2.5-model access to users who have actively used the family before. [Gemini 2.5 Flash-Lite](https://ai.google.dev/gemini-api/docs/models/gemini-2.5-flash-lite)
- **Schema capability:** Gemini Structured Outputs accepts JSON Schema and is intended for predictable structured extraction/classification; Google still instructs applications to validate values and handle semantically incorrect responses. [Gemini Structured Outputs](https://ai.google.dev/gemini-api/docs/structured-output)
- **Key handling:** `GEMINI_API_KEY` exists only in server environment variables. `.env` is ignored; `.env.example` contains no real key.
- **Free-tier limitations:** free input/output token pricing does not mean unlimited availability. Rate limits depend on account and project, are enforced across request/token/day dimensions, and can produce `429 RESOURCE_EXHAUSTED`; active limits must be checked in Google AI Studio. Free-tier content may be used to improve Google products, so the demo should use a non-sensitive, realistic sample offer—not real private communications. [Gemini rate limits](https://ai.google.dev/gemini-api/docs/rate-limits), [Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing)

## Important Failure Modes

- **Empty, too-short, or over-12,000-character input** → the client prevents the API request, keeps the text editable, and gives inline guidance. The server repeats the length check in case a request bypasses the client.
- **Primary Gemini model unavailable** → the server attempts `gemini-2.5-flash-lite` once only if appropriate. If no model is available, the UI keeps the input and shows a non-technical retry message.
- **Rate limit, timeout, temporary Gemini outage, or network failure** → the server returns a recoverable failure; the UI retains the original text and exposes **Try again**. Rate-limit responses do not trigger a model fallback.
- **Missing/invalid server API key** → the server logs only a safe diagnostic locally and returns a generic configuration/analysis failure; no key details are shown in the browser.
- **Malformed schema output or invalid evidence quote** → the server returns no analysis. It logs a safe validation failure and shows the existing generic retry state, because showing an unsupported source quote would violate SignalCheck’s kernel.

## What Was Simplified and Why

- **One server endpoint and one analysis request** instead of streaming, background jobs, or multi-step agent orchestration — the result is small enough to demo and the PRD explicitly disallows partial results.
- **In-memory client state** instead of a database or local history — each analysis intentionally disappears when the person starts another.
- **Structured Gemini response plus exact-substring validation** instead of a retrieval/citation system — it directly proves the evidence-first kernel without adding vector storage, file processing, or another service.
- **Automatic two-model sequence** instead of model controls — it protects a new-key demo without adding an implementation-facing choice to the user experience.
- **Plain CSS** instead of a component library — the visual direction is specific but small enough to implement directly.

## Decisions and Open Issues

- **Learner decision:** React/Vite client plus Node/Express server — chosen for a small, maintainable local POC with a server-only API key.
- **Learner decision:** Gemini Developer API with `gemini-3.5-flash-lite` primary and conditional `gemini-2.5-flash-lite` fallback — selected to favor a newly configured key and Free-tier token usage while retaining a narrow fallback.
- **Learner decision:** validate a 12,000-character maximum before any Gemini request — prevents accidental oversized free-tier usage and keeps the text editable after rejection.
- **Learner decision:** mandatory exact-substring validation for every returned evidence quote — Structured Outputs control shape, while the server independently protects the source-of-truth rule.
- **Implementation decision derived from the PRD:** use an 80-character minimum for meaningful analysis — it operationalizes the approved “very short input” state and can be adjusted during the first manual test if it rejects a reasonable short offer.
- **Clarified uncertainty:** initial provider/model selection was open. The learner asked for Gemini, then chose 3.5 Flash-Lite after the current official docs showed that 2.5 Flash-Lite access may be restricted for new projects. The build will verify actual model access with the newly configured key before styling the full workflow.
- **Open issue, non-blocking:** exact Free-tier request/token/day limits vary by account/project and must be viewed in Google AI Studio; the POC handles a rate-limit error rather than assuming a fixed quota.
