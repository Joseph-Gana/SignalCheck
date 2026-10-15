# SignalCheck

**Understand before you decide.**

SignalCheck is an evidence-first tool for reviewing an important written offer, message, announcement, or proposal before acting on it. Paste one piece of text and review four clearly separated categories:

- **Facts** — statements explicitly established by the supplied text.
- **Ambiguities** — wording or conditions whose meaning is unclear.
- **Information Not Stated** — relevant details absent from the supplied text, without claiming they must exist.
- **Questions to Ask** — practical follow-up questions prompted by the analysis.

## Evidence and safety

The original supplied text is the source of truth. AI-generated findings and questions are clearly presented as aids, not as facts or decisions. Facts and Ambiguities include source evidence only when the server confirms the quote is an exact substring of the text the person supplied.

SignalCheck does not issue verdicts, label content as a scam, or recommend accepting or rejecting an offer.

## Stack

- React and Vite frontend
- Node.js and Express server
- Gemini API through `@google/genai`
- Zod validation for structured analysis responses

## Project structure

```text
src/        React interface
server/     Express API, Gemini integration, and evidence validation
devpost/    Project planning and development record
```

## Run locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env`, then set a server-side `GEMINI_API_KEY`.

3. Start the Express API:

   ```bash
   npm run dev:server
   ```

4. In another terminal, start the Vite frontend:

   ```bash
   npm run dev:client
   ```

Open the local URL printed by Vite. The development frontend calls the local Express API at port 3001. Never place the Gemini key in client code or a `VITE_` variable.

## Production deployment

Build the frontend:

```bash
npm run build
```

Start the production service:

```bash
npm start
```

The recommended deployment is one Node/Express web service. Express serves `dist/` and handles `/api/analyze` on the same HTTPS origin, while `GEMINI_API_KEY` is configured only in the hosting provider’s server environment. No database, accounts, or persistence are required.

For a split frontend/API deployment, set `VITE_API_BASE_URL` at frontend build time and set `CORS_ORIGIN` to the exact frontend origin. Do not use wildcard CORS.

## Privacy and demo notes

SignalCheck does not save submitted text or analysis history. The Gemini API key remains server-side. Use a realistic but non-sensitive sample offer in the hackathon demo, and keep API keys, credentials, and private user text out of recordings, logs, and commits.

The API includes a small in-memory request limit for the public demo endpoint. It is intended to protect a hackathon deployment’s Gemini quota, not replace production-grade abuse controls.
