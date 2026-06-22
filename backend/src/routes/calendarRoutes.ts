import { Elysia } from 'elysia';
import { CalendarModel, CreateCalendarData } from '../models/Calendar';
import { authMiddleware } from '../middlewares/authMiddleware';
import { ValidationError, ForbiddenError } from '../lib/errors';

export const calendarRoutes = new Elysia({ prefix: '/api/calendars' })
  .use(authMiddleware)

  // POST /api/calendars - Create new calendar
  .post('/', ({ body, userId, set }) => {
    set.status = 201;
    return CalendarModel.create({
      calendar_name: (body as any).calendar_name,
      creator_user_id: userId,
    } as CreateCalendarData);
  })

  // GET /api/calendars/:id - Get calendar by ID
  .get('/:id', ({ params }) => CalendarModel.findById(params.id))

  // GET /api/calendars/user/:userId - Get calendar by user ID
  .get('/user/:userId', async ({ params, userId }) => {
    if (params.userId !== userId) {
      throw new ForbiddenError('Not authorized to access this calendar');
    }
    const calendar = await CalendarModel.findByUserId(userId);
    if (!calendar) return null;
    return CalendarModel.toResponse(calendar);
  })

  // POST /api/calendars/join - Join calendar by join code
  .post('/join', async ({ body, userId }) => {
    const { join_code } = body as { join_code?: string };
    if (!join_code) {
      throw new ValidationError('Join code is required');
    }

    const calendar = await CalendarModel.findByJoinCode(join_code);
    if (!calendar) {
      throw new ValidationError('Invalid join code');
    }

    const existingMembership = await CalendarModel.getMembership(userId, calendar.calendar_id);
    if (existingMembership) {
      return CalendarModel.toResponse(calendar);
    }

    await CalendarModel.addMember(calendar.calendar_id, userId);
    return CalendarModel.toResponse(calendar);
  })

  // GET /api/calendars - Get all calendars for authenticated user
  .get('/', async ({ userId }) => {
    const calendars = await CalendarModel.getUserCalendars(userId);
    return calendars.map((calendar) => CalendarModel.toResponse(calendar));
  });
