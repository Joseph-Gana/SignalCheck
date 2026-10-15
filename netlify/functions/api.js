
import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';

import { analyzeRouter } from '../../server/routes/analyze.js';
import { createAnalyzeRateLimiter } from '../../server/middleware/rateLimit.js';

const app = express();

app.set('trust proxy', 1);

const localDevelopmentOrigins = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || localDevelopmentOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(null, false);
    },
  })
);

app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (request, response) => {
  response.json({ status: 'ok' });
});

app.use(
  '/api/analyze',
  createAnalyzeRateLimiter(),
  analyzeRouter
);

export const handler = serverless(app);
