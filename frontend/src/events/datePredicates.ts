/**
 * Pure date predicates used by the events domain.
 *
 * Every predicate takes `now: Date` so tests can pin time without fake timers.
 * Call sites in components/stores can omit `now` and get the current time.
 *
 * `getStartOfDay` is exported because both the predicates below and the
 * event store's upstream computeds (`upcomingEvents`, `recentEvents`) need
 * to normalize "today" for boundary comparisons.
 */

export const getStartOfDay = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/** True if `date` falls on the same calendar day as `now`. */
export const isToday = (date: Date, now: Date = new Date()): boolean =>
  getStartOfDay(date).getTime() === getStartOfDay(now).getTime();

/**
 * True if `eventDate` is on the same calendar day as `now` and strictly before `now` in time.
 */
export const isEarlierToday = (
  eventDate: Date,
  now: Date = new Date(),
): boolean =>
  getStartOfDay(eventDate).getTime() === getStartOfDay(now).getTime() &&
  new Date(eventDate).getTime() < now.getTime();

/**
 * True if `date` falls within the next calendar week (Sunday to Saturday) relative to `now`.
 * The "next week" starts on the first Sunday strictly after the current week's Saturday.
 */
export const isNextWeek = (date: Date, now: Date = new Date()): boolean => {
  const today = getStartOfDay(now);
  const nextWeekStart = new Date(today);
  nextWeekStart.setDate(today.getDate() + ((7 - today.getDay()) % 7));
  if (nextWeekStart.getTime() <= today.getTime()) {
    nextWeekStart.setDate(nextWeekStart.getDate() + 7);
  }

  const nextWeekEnd = new Date(nextWeekStart);
  nextWeekEnd.setDate(nextWeekStart.getDate() + 6);

  const eventDate = getStartOfDay(date);
  return (
    eventDate.getTime() >= nextWeekStart.getTime() &&
    eventDate.getTime() <= nextWeekEnd.getTime()
  );
};

/** True if `date` falls within the calendar month after `now`'s month. */
export const isNextMonth = (date: Date, now: Date = new Date()): boolean => {
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const nextMonthValue = currentMonth === 11 ? 0 : currentMonth + 1;
  const yearOfNextMonth = currentMonth === 11 ? currentYear + 1 : currentYear;

  const eventDate = getStartOfDay(date);
  return (
    eventDate.getMonth() === nextMonthValue &&
    eventDate.getFullYear() === yearOfNextMonth
  );
};

/** True if `eventDate` falls within the 7 days strictly before `now`'s day. */
export const isPastWeek = (
  eventDate: Date,
  now: Date = new Date(),
): boolean => {
  const today = getStartOfDay(now);
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 7);
  const eventStart = getStartOfDay(eventDate);

  return (
    eventStart.getTime() >= oneWeekAgo.getTime() &&
    eventStart.getTime() < today.getTime()
  );
};

/** True if `eventDate` falls within the calendar month strictly before `now`'s month. */
export const isPastMonth = (
  eventDate: Date,
  now: Date = new Date(),
): boolean => {
  const today = getStartOfDay(now);
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(today.getMonth() - 1);
  const eventStart = getStartOfDay(eventDate);

  return (
    eventStart.getTime() >= oneMonthAgo.getTime() &&
    eventStart.getTime() < today.getTime()
  );
};
