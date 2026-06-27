import { Elysia, type ElysiaAdapter } from 'elysia';
import { cors } from '@elysiajs/cors';
import { authRoutes, authProtectedRoutes } from '../routes/authRoutes';
import { eventRoutes } from '../routes/eventRoutes';
import { calendarRoutes } from '../routes/calendarRoutes';
import { profileRoutes } from '../routes/profileRoutes';
import { successWrap } from '../plugins/successWrap';
import { errorHandler } from '../plugins/errorHandler';

export const createApp = (adapter?: ElysiaAdapter) =>
  new Elysia({ adapter })
    .use(cors())
    .use(successWrap)
    .use(errorHandler)
    .use(authRoutes)
    .use(authProtectedRoutes)
    .use(eventRoutes)
    .use(calendarRoutes)
    .use(profileRoutes)
    .get('/', () => 'Backend is running');

export const app = createApp();
