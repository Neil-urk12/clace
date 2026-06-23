import type { SharedEventItem } from '@/types/event';
import {
  isEarlierToday,
  isNextMonth,
  isNextWeek,
  isPastMonth,
  isPastWeek,
  isToday,
} from './datePredicates';

export type EventPrimaryFilter = 'Upcoming' | 'Recent';

/**
 * Apply primary, secondary, and search filters to a list of events.
 *
 * - `primary` determines which secondary filter set is valid
 *   ('Upcoming' → Today/NextWeek/NextMonth; 'Recent' → EarlierToday/PastWeek/PastMonth).
 * - Any other `secondary` value (including 'All' or unknown) returns the input unchanged.
 * - `query` is matched case-insensitively against title, description, subject, course,
 *   location, type, and status. An empty `query` returns the input unchanged.
 */
export const applyEventFilters = (
  events: SharedEventItem[],
  primary: EventPrimaryFilter,
  secondary: string,
  query: string,
  now: Date = new Date(),
): SharedEventItem[] => {
  let bySecondary: SharedEventItem[];

  if (primary === 'Upcoming') {
    switch (secondary) {
      case 'Today':
        bySecondary = events.filter((e) => isToday(e.startDate, now));
        break;
      case 'NextWeek':
        bySecondary = events.filter((e) => isNextWeek(e.startDate, now));
        break;
      case 'NextMonth':
        bySecondary = events.filter((e) => isNextMonth(e.startDate, now));
        break;
      default:
        bySecondary = events;
    }
  } else {
    switch (secondary) {
      case 'EarlierToday':
        bySecondary = events.filter((e) => isEarlierToday(e.startDate, now));
        break;
      case 'PastWeek':
        bySecondary = events.filter((e) => isPastWeek(e.startDate, now));
        break;
      case 'PastMonth':
        bySecondary = events.filter((e) => isPastMonth(e.startDate, now));
        break;
      default:
        bySecondary = events;
    }
  }

  const q = query.toLowerCase();
  if (!q) return bySecondary;
  return bySecondary.filter(
    (event) =>
      event.title.toLowerCase().includes(q) ||
      (event.description?.toLowerCase().includes(q) ?? false) ||
      (event.subject?.toLowerCase().includes(q) ?? false) ||
      (event.course?.toLowerCase().includes(q) ?? false) ||
      (event.location?.toLowerCase().includes(q) ?? false) ||
      event.type.toLowerCase().includes(q) ||
      (event.status?.toLowerCase().includes(q) ?? false),
  );
};
