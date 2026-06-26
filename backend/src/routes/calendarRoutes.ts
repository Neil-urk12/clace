import { Elysia, t } from 'elysia';
import { CalendarModel } from '../models/Calendar';
import { authMiddleware } from '../middlewares/authMiddleware';
import { ForbiddenError, ValidationError } from '../lib/errors';

const CreateCalendarBody = t.Object({
  calendar_name: t.String(),
});

const JoinCalendarBody = t.Object({
  join_code: t.String({ minLength: 1 }),
});

export const calendarRoutes = new Elysia({ prefix: '/api/calendars' })
  .use(authMiddleware)

  // POST /api/calendars - Create new calendar
  .post('/', ({ body, userId, set }) => {
    set.status = 201;
    return CalendarModel.create({
      calendar_name: body.calendar_name,
      creator_user_id: userId,
    });
  }, {
    body: CreateCalendarBody,
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
  .post('/join', async ({ userId, body }) => {
    const calendar = await CalendarModel.findByJoinCode(body.join_code);
    if (!calendar) {
      throw new ValidationError('Invalid join code');
    }

    const existingMembership = await CalendarModel.getMembership(userId, calendar.id);
    if (existingMembership) {
      return CalendarModel.toResponse(calendar);
    }

    await CalendarModel.addMember(calendar.id, userId);
    return CalendarModel.toResponse(calendar);
  }, {
    body: JoinCalendarBody,
  })

  // GET /api/calendars - Get all calendars for authenticated user
  .get('/', async ({ userId }) => {
    const calendars = await CalendarModel.getUserCalendars(userId);
    return calendars.map((calendar) => CalendarModel.toResponse(calendar));
  });