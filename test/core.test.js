import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  isoWeek,
  isoYear,
  isoWeekAndYear,
  fromIsoWeek,
  weeksInIsoYear,
} from '../src/core.js';

function date(y, m, d) {
  return new Date(y, m - 1, d);
}

test('isoWeek: 2021-07-15 is week 28', () => {
  assert.equal(isoWeek(date(2021, 7, 15)), 28);
});

test('isoYear: 2021-07-15 is 2021', () => {
  assert.equal(isoYear(date(2021, 7, 15)), 2021);
});

test('isoWeekAndYear: returns object with week and year', () => {
  const r = isoWeekAndYear(date(2021, 7, 15));
  assert.deepEqual(r, { week: 28, year: 2021 });
});

test('isoWeek: 2020-12-31 is week 53 of 2020', () => {
  assert.equal(isoWeek(date(2020, 12, 31)), 53);
});

test('isoYear: 2020-12-31 belongs to 2020', () => {
  assert.equal(isoYear(date(2020, 12, 31)), 2020);
});

test('isoWeekAndYear: 2020-12-31 is week 53 of 2020', () => {
  assert.deepEqual(isoWeekAndYear(date(2020, 12, 31)), { week: 53, year: 2020 });
});

test('isoWeek: 2016-01-01 belongs to week 53 of 2015', () => {
  assert.equal(isoWeek(date(2016, 1, 1)), 53);
});

test('isoYear: 2016-01-01 belongs to 2015', () => {
  assert.equal(isoYear(date(2016, 1, 1)), 2015);
});

test('isoWeekAndYear: 2016-01-01 is week 53 of 2015', () => {
  assert.deepEqual(isoWeekAndYear(date(2016, 1, 1)), { week: 53, year: 2015 });
});

test('weeksInIsoYear: 2020 has 53 weeks', () => {
  assert.equal(weeksInIsoYear(2020), 53);
});

test('weeksInIsoYear: 2021 has 52 weeks', () => {
  assert.equal(weeksInIsoYear(2021), 52);
});

test('weeksInIsoYear: 2015 has 53 weeks', () => {
  assert.equal(weeksInIsoYear(2015), 53);
});

test('fromIsoWeek: Monday of 2021-W1 is 2021-01-04', () => {
  const d = fromIsoWeek(2021, 1);
  assert.equal(d.getFullYear(), 2021);
  assert.equal(d.getMonth(), 0);
  assert.equal(d.getDate(), 4);
});

test('fromIsoWeek: Monday of 2021-W53 is 2021-12-27', () => {
  const d = fromIsoWeek(2021, 53);
  assert.equal(d.getFullYear(), 2021);
  assert.equal(d.getMonth(), 11);
  assert.equal(d.getDate(), 27);
});

test('round-trip: fromIsoWeek(2020, 1) Monday is week 1 of 2020', () => {
  const d = fromIsoWeek(2020, 1);
  const r = isoWeekAndYear(d);
  assert.deepEqual(r, { week: 1, year: 2020 });
});

test('round-trip: fromIsoWeek(2015, 53) Monday is week 53 of 2015', () => {
  const d = fromIsoWeek(2015, 53);
  const r = isoWeekAndYear(d);
  assert.deepEqual(r, { week: 53, year: 2015 });
});

test('round-trip: fromIsoWeek(2016, 52) Monday is week 52 of 2016', () => {
  const d = fromIsoWeek(2016, 52);
  const r = isoWeekAndYear(d);
  assert.deepEqual(r, { week: 52, year: 2016 });
});

test('isoWeek: 2004-12-31 is week 53 of 2004 (Friday)', () => {
  assert.equal(isoWeek(date(2004, 12, 31)), 53);
});

test('isoWeekAndYear: 2012-01-01 is week 52 of 2011', () => {
  assert.deepEqual(isoWeekAndYear(date(2012, 1, 1)), { week: 52, year: 2011 });
});
