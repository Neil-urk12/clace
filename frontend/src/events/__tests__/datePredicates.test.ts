import { describe, it, expect } from 'vitest';
import {
  isEarlierToday,
  isNextMonth,
  isNextWeek,
  isPastMonth,
  isPastWeek,
  isToday,
} from '../datePredicates';

/** Build a Date in local time (avoids UTC-vs-local boundary drift in tests). */
const at = (year: number, month: number, day: number, hour = 12): Date =>
  new Date(year, month - 1, day, hour, 0, 0, 0);

describe('isToday', () => {
  const now = at(2026, 6, 23, 10);

  it('returns true for the same calendar day', () => {
    expect(isToday(at(2026, 6, 23, 14), now)).toBe(true);
    expect(isToday(at(2026, 6, 23, 0), now)).toBe(true);
    expect(isToday(at(2026, 6, 23, 23), now)).toBe(true);
  });

  it('returns false for a different day', () => {
    expect(isToday(at(2026, 6, 22, 23), now)).toBe(false);
    expect(isToday(at(2026, 6, 24, 0), now)).toBe(false);
  });
});

describe('isEarlierToday', () => {
  const now = at(2026, 6, 23, 10);

  it('returns true for the same day, earlier in time', () => {
    expect(isEarlierToday(at(2026, 6, 23, 9), now)).toBe(true);
    expect(isEarlierToday(at(2026, 6, 23, 0), now)).toBe(true);
  });

  it('returns false for the same day, later in time', () => {
    expect(isEarlierToday(at(2026, 6, 23, 11), now)).toBe(false);
    expect(isEarlierToday(at(2026, 6, 23, 10), now)).toBe(false);
  });

  it('returns false for a different day', () => {
    expect(isEarlierToday(at(2026, 6, 22, 9), now)).toBe(false);
    expect(isEarlierToday(at(2026, 6, 24, 9), now)).toBe(false);
  });
});

describe('isNextWeek', () => {
  // Wednesday 2026-06-24: next week = Sun 2026-06-28 .. Sat 2026-07-04
  const now = at(2026, 6, 24, 12);

  it('returns true for dates in the next week (Sun..Sat)', () => {
    expect(isNextWeek(at(2026, 6, 28), now)).toBe(true); // Sunday
    expect(isNextWeek(at(2026, 6, 30), now)).toBe(true); // Tuesday
    expect(isNextWeek(at(2026, 7, 4), now)).toBe(true); // Saturday
  });

  it('returns false for the current week', () => {
    expect(isNextWeek(at(2026, 6, 24), now)).toBe(false); // Wednesday (today)
    expect(isNextWeek(at(2026, 6, 27), now)).toBe(false); // Saturday (this week)
  });

  it('returns false for the week after next', () => {
    expect(isNextWeek(at(2026, 7, 5), now)).toBe(false); // Sunday after next
  });
});

describe('isNextMonth', () => {
  it('returns true for a date in the following month', () => {
    expect(isNextMonth(at(2026, 7, 1), at(2026, 6, 15))).toBe(true);
    expect(isNextMonth(at(2026, 7, 31), at(2026, 6, 15))).toBe(true);
  });

  it('returns false for the same month', () => {
    expect(isNextMonth(at(2026, 6, 30), at(2026, 6, 15))).toBe(false);
  });

  it('wraps the year at December', () => {
    expect(isNextMonth(at(2027, 1, 1), at(2026, 12, 15))).toBe(true);
  });
});

describe('isPastWeek', () => {
  // Tuesday 2026-06-23: window = Tue 2026-06-16 00:00 .. Tue 2026-06-23 00:00
  const now = at(2026, 6, 23, 10);

  it('returns true for dates in the 7 days before today', () => {
    expect(isPastWeek(at(2026, 6, 22), now)).toBe(true); // 1 day ago
    expect(isPastWeek(at(2026, 6, 20), now)).toBe(true); // 3 days ago
    expect(isPastWeek(at(2026, 6, 16), now)).toBe(true); // exactly 7 days ago
  });

  it('returns false for more than 7 days ago', () => {
    expect(isPastWeek(at(2026, 6, 15), now)).toBe(false);
    expect(isPastWeek(at(2026, 6, 1), now)).toBe(false);
  });

  it('returns false for today (excluded)', () => {
    expect(isPastWeek(at(2026, 6, 23, 9), now)).toBe(false);
    expect(isPastWeek(at(2026, 6, 23, 0), now)).toBe(false);
  });
});

describe('isPastMonth', () => {
  const now = at(2026, 6, 15, 12);

  it('returns true for dates within the calendar month before now', () => {
    expect(isPastMonth(at(2026, 6, 14), now)).toBe(true); // 1 day ago
    expect(isPastMonth(at(2026, 5, 15), now)).toBe(true); // exactly 1 month ago
  });

  it('returns false for earlier than 1 month ago', () => {
    expect(isPastMonth(at(2026, 5, 14), now)).toBe(false);
  });

  it('returns false for today (excluded)', () => {
    expect(isPastMonth(at(2026, 6, 15, 11), now)).toBe(false);
  });
});
