import { CloudflareAdapter } from 'elysia/adapter/cloudflare-worker';
import { createApp } from './core/app';

export default createApp(CloudflareAdapter);
