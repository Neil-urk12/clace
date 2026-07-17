// backend/src/worker.ts

import { createApp } from './core/app';
import type { Env } from './core/config';

export default {
  fetch(request: Request, env: Env, _ctx: unknown) {
    const app = createApp(env);
    return app.fetch(request);
  },
} satisfies { fetch(request: Request, env: Env, ctx: unknown): Response | Promise<Response> };
