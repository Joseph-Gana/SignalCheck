import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyzeRouter } from './routes/analyze.js';
import { createAnalyzeRateLimiter } from './middleware/rateLimit.js';

const app = express();
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const distDirectory = path.resolve(currentDirectory, '../dist');
const localDevelopmentOrigins = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173'
]);
const configuredOrigins = new Set(
  (process.env.CORS_ORIGIN || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean)
);

app.set('trust proxy', 1);

app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        localDevelopmentOrigins.has(origin) ||
        configuredOrigins.has(origin)
      ) {
        callback(null, true);
        return;
      }

      callback(null, false);
    }
  })
);

app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (request, response) => {
  response.json({
    status: 'ok'
  });
});

app.use('/api/analyze', createAnalyzeRateLimiter(), analyzeRouter);

app.use(express.static(distDirectory));

app.get(/^(?!\/api(?:\/|$)).*/, (request, response) => {
  response.sendFile(path.join(distDirectory, 'index.html'));
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(
    `SignalCheck server listening on http://localhost:${port}`
  );
});
