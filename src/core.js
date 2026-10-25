/**
 * Core ISO-8601 week-date logic, independent of any runtime clock.
 *
 * Every function takes a plain `Date` and treats it as an instant in time.
 * The {@link fromIsoWeek} factory builds such an instant from a calendar
 * (isoYear, isoWeek) pair, so tests can exercise year-boundary edge cases
 * without depending on the system clock.
 */

/**
 * Day-of-week index where Monday = 1 … Sunday = 7, matching ISO-8601.
 *
 * `Date#getDay()` returns Sunday = 0 … Saturday = 6, so we remap and wrap
 * Sunday (0) to 7 to make weekday arithmetic throughout this module
 * straightforward.
 *
 * @param {Date} date - A local-time `Date`.
 * @returns {number} ISO weekday (1–7).
 */
function isoDayOfWeek(date) {
  const jsDay = date.getDay();
  return jsDay === 0 ? 7 : jsDay;
}

/**
 * Thursday of the ISO week containing `date`, as a local `Date`.
 *
 * ISO-8601 weeks belong to the year that owns their Thursday. This helper
 * centralises the “jump to Thursday” step shared by week-number and
 * week-year computation, keeping the two consistent and obvious.
 *
 * @param {Date} date - A local-time `Date`.
 * @returns {Date} The Thursday of the same ISO week as `date`.
 */
function thursdayOf(date) {
  const dow = isoDayOfWeek(date);
  const d = new Date(date);
  d.setDate(d.getDate() + (4 - dow));
  return d;
}

/**
 * Compute the ISO-8601 week number for a local-time `Date`.
 *
 * Algorithm: Thursday-determination. The Thursday of `date`'s ISO week lies
 * in the same Gregorian year as the ISO week year, so we compute the ordinal
 * day-of-year of that Thursday and divide by 7 with ceiling rounding.
 *
 * A week fully inside December can roll into the *next* year's week 1 (e.g.
 * 2020-12-31 is week 1 of 2021); a week fully inside January can belong to
 * the *previous* year's final week (e.g. 2016-01-01 is week 53 of 2015).
 * Using Thursday avoids off-by-one mistakes at both boundaries.
 *
 * @param {Date} date - A local-time `Date`.
 * @returns {number} ISO week number, 1–53.
 */
export function isoWeek(date) {
  return isoWeekAndYear(date).week;
}

/**
 * Compute the ISO-8601 week-numbering year for a local-time `Date`.
 *
 * The week-numbering year is the Gregorian year of the Thursday of the
 * ISO week containing `date`. It differs from the calendar year near
 * year boundaries (see {@link isoWeek}).
 *
 * @param {Date} date - A local-time `Date`.
 * @returns {number} ISO week-numbering year (e.g. 2021).
 */
export function isoYear(date) {
  return thursdayOf(date).getFullYear();
}

/**
 * Compute both the ISO week number and the ISO week-numbering year for a
 * local-time `Date`, as a single object.
 *
 * Week number and week-year are computed from the same Thursday, so this is
 * the canonical way to obtain both; calling {@link isoWeek} and
 * {@link isoYear} separately is fine but performs the Thursday lookup
 * twice.
 *
 * @param {Date} date - A local-time `Date`.
 * @returns {{week: number, year: number}} ISO week (1–53) and ISO year.
 */
export function isoWeekAndYear(date) {
  const thu = thursdayOf(date);
  const year = thu.getFullYear();
  const jan1 = new Date(year, 0, 1);
  const ordinal = Math.round((thu - jan1) / 86_400_000) + 1;
  const week = Math.ceil(ordinal / 7);
  return { week, year };
}

/**
 * Count the number of ISO weeks in a given ISO week-numbering year.
 *
 * ISO-8601 years have either 52 or 53 weeks. A year has 53 weeks when its
 * first day is Thursday, or (for leap years) when its first day is Wednesday
 * and its last day is Thursday. All other years have 52 weeks.
 *
 * @param {number} isoYear - The ISO week-numbering year.
 * @returns {number} 52 or 53.
 */
export function weeksInIsoYear(isoYear) {
  const jan1 = new Date(isoYear, 0, 1);
  const jan1Dow = isoDayOfWeek(jan1);
  if (jan1Dow === 4) return 53;
  const isLeap = ((isoYear % 4 === 0 && isoYear % 100 !== 0) || isoYear % 400 === 0);
  if (isLeap && jan1Dow === 3) return 53;
  return 52;
}

/**
 * Build the local Date of the Monday that starts ISO week `week` of ISO
 * week-numbering year `isoYear`.
 *
 * Monday of ISO week 1 is the Gregorian date nearest to January 1 that is a
 * Monday. ISO week 1 is the week containing the year's first Thursday, which
 * is equivalent to the week containing January 4, so its Monday is always
 * between December 29 of the prior year and January 4 of `isoYear`.
 *
 * We anchor on January 4 (always in week 1), shift to that week's Monday,
 * then add `week - 1` weeks. Invalid `week` values clamp to the nearest
 * valid week, so callers never receive an out-of-range Date from a stray
 * input.
 *
 * @param {number} isoYear - The ISO week-numbering year.
 * @param {number} week - ISO week number (1–53). Out-of-range values clamp.
 * @returns {Date} Local Date of the Monday starting the given ISO week.
 */
export function fromIsoWeek(isoYear, week) {
  const max = weeksInIsoYear(isoYear);
  const clamped = week < 1 ? 1 : week > max ? max : week;
  const jan4 = new Date(isoYear, 0, 4);
  const jan4Dow = isoDayOfWeek(jan4);
  const week1Monday = new Date(jan4);
  week1Monday.setDate(week1Monday.getDate() - (jan4Dow - 1));
  const result = new Date(week1Monday);
  result.setDate(result.getDate() + (clamped - 1) * 7);
  return result;
}
