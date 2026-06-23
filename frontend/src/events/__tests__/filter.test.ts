import { describe, it, expect } from 'vitest';
import { applyEventFilters, type EventPrimaryFilter } from '../filter';
import type { SharedEventItem } from '@/types/event';

const at = (year: number, month: number, day: number, hour = 10): Date =>
  new Date(year, month - 1, day, hour, 0, 0, 0);

// "Now" pinned for every test. Tuesday 2026-06-23 at 10:00 local time.
const now = at(2026, 6, 23, 10);

const make = (overrides: Partial<SharedEventItem> & { startDate: Date }): SharedEventItem => ({
  id: overrides.id ?? overrides.startDate.toISOString(),
  title: '',
  allDay: false,
  type: 'GeneralActivity',
  ...overrides,
});

// Upcoming pool: startDate >= today (June 23 00:00)
const u1 = make({ startDate: at(2026, 6, 23, 14), title: 'Math Quiz', description: 'Linear algebra' });
const u2 = make({ startDate: at(2026, 6, 24, 10), title: 'Physics Lab', description: 'Mechanics' });
const u3 = make({ startDate: at(2026, 6, 28, 10), title: 'CS Lab', description: 'Algorithms' });
const u4 = make({ startDate: at(2026, 7, 4, 10), title: 'Final Exam', description: 'Cumulative' });
const u5 = make({ startDate: at(2026, 7, 15, 10), title: 'Group Project', description: 'Design' });
const u6 = make({ startDate: at(2026, 6, 23, 10), title: 'Standup', description: 'Daily sync', type: 'ClassSession' });
const upcoming = [u1, u2, u3, u4, u5, u6];

// Recent pool: startDate < today (June 23 00:00)
const r1 = make({ startDate: at(2026, 6, 23, 9), title: 'Morning Brief', description: 'Status update' });
const r2 = make({ startDate: at(2026, 6, 22, 10), title: 'Yesterday Event', description: 'Homework review', type: 'Assignment' });
const r3 = make({ startDate: at(2026, 6, 16, 10), title: 'Last Week Event', description: 'Old tasks' });
const r4 = make({ startDate: at(2026, 6, 15, 10), title: 'Old Event', description: 'Stale' });
const r5 = make({ startDate: at(2026, 5, 23, 10), title: 'Last Month Event', description: 'Monthly review' });
const r6 = make({ startDate: at(2026, 4, 15, 10), title: 'Old Project', description: 'Archived' });
const recent = [r1, r2, r3, r4, r5, r6];

const ids = (events: SharedEventItem[]): string[] => events.map((e) => e.id);

describe('applyEventFilters — upcoming primary', () => {
  it('Today returns only today\'s events', () => {
    expect(ids(applyEventFilters(upcoming, 'Upcoming', 'Today', '', now))).toEqual([u1.id, u6.id]);
  });

  it('NextWeek returns events in the next calendar week', () => {
    expect(ids(applyEventFilters(upcoming, 'Upcoming', 'NextWeek', '', now))).toEqual([u3.id, u4.id]);
  });

  it('NextMonth returns events in the next calendar month', () => {
    // u4 (July 4) and u5 (July 15) are both in July, the month after now's June.
    expect(ids(applyEventFilters(upcoming, 'Upcoming', 'NextMonth', '', now))).toEqual([u4.id, u5.id]);
  });

  it('All returns the full pool', () => {
    expect(ids(applyEventFilters(upcoming, 'Upcoming', 'All', '', now))).toEqual(ids(upcoming));
  });

  it('unknown secondary falls through to All', () => {
    expect(ids(applyEventFilters(upcoming, 'Upcoming', 'Bogus', '', now))).toEqual(ids(upcoming));
  });
});

describe('applyEventFilters — recent primary', () => {
  it('EarlierToday returns events earlier today only', () => {
    expect(ids(applyEventFilters(recent, 'Recent', 'EarlierToday', '', now))).toEqual([r1.id]);
  });

  it('PastWeek returns the past 7 days (excluding today)', () => {
    // r1 is on today (June 23) — today is strictly excluded.
    expect(ids(applyEventFilters(recent, 'Recent', 'PastWeek', '', now))).toEqual([r2.id, r3.id]);
  });

  it('PastMonth returns the past calendar month (excluding today)', () => {
    // Window = May 23 00:00 .. June 23 00:00. r1 (today) excluded; r4 (June 15) included.
    expect(ids(applyEventFilters(recent, 'Recent', 'PastMonth', '', now))).toEqual([r2.id, r3.id, r4.id, r5.id]);
  });

  it('All returns the full pool', () => {
    expect(ids(applyEventFilters(recent, 'Recent', 'All', '', now))).toEqual(ids(recent));
  });
});

describe('applyEventFilters — search', () => {
  it('empty query does not filter', () => {
    expect(applyEventFilters(upcoming, 'Upcoming', 'All', '', now)).toEqual(upcoming);
  });

  it('matches case-insensitively on title', () => {
    expect(ids(applyEventFilters(upcoming, 'Upcoming', 'All', 'MATH', now))).toEqual([u1.id]);
  });

  it('matches case-insensitively on description', () => {
    expect(ids(applyEventFilters(recent, 'Recent', 'All', 'homework', now))).toEqual([r2.id]);
  });

  it('matches on type (required field)', () => {
    expect(ids(applyEventFilters(upcoming, 'Upcoming', 'All', 'standup', now))).toEqual([u6.id]);
  });

  it('search narrows the secondary filter (Upcoming + Today + "math")', () => {
    expect(ids(applyEventFilters(upcoming, 'Upcoming', 'Today', 'math', now))).toEqual([u1.id]);
  });

  it('search that matches nothing returns empty', () => {
    expect(applyEventFilters(upcoming, 'Upcoming', 'All', 'nonsense', now)).toEqual([]);
  });
});

describe('applyEventFilters — type contract', () => {
  it('returns a new array (does not mutate input)', () => {
    const input = [...upcoming];
    applyEventFilters(input, 'Upcoming' as EventPrimaryFilter, 'All', '', now);
    expect(input).toEqual(upcoming);
  });
});
