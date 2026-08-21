// A timestamp → the calendar day it belongs to. Local, not UTC: a grid is read against the days the
// reader lived through, and a turn at 11pm belongs to the square under today.
//
// Formatted by hand rather than through `toISOString`, which converts to UTC first and would shift
// every evening turn into tomorrow.
export const dayKey = (at: number): string => {
  const date: Date = new Date(at);
  const month: string = String(date.getMonth() + 1).padStart(2, '0');
  const day: string = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

// Midnight local on the day `at` falls in. What the grid measures its columns from.
export const dayStart = (at: number): number => {
  const date: Date = new Date(at);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

export const DAY_MS: number = 24 * 60 * 60 * 1000;

interface ShiftDaysArgs {
  from: number;
  days: number;
}

// N days either side of a timestamp, landing on midnight. Adding `days * DAY_MS` is wrong twice a
// year — a DST boundary makes a day 23 or 25 hours long, and the drift shows up as a column that
// repeats a date.
export const shiftDays = ({ from, days }: ShiftDaysArgs): number => {
  const date: Date = new Date(from);
  date.setDate(date.getDate() + days);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};
