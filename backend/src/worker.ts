// backend/src/worker.ts

import { CloudflareAdapter } from 'elysia/adapter/cloudflare-worker';
import { app } from './core/app';

export default CloudflareAdapter(app);
