# simple-iso-weeks

ISO-8601 week numbers for JavaScript, with explicit handling of the year-boundary cases where a week in late December belongs to the next year, or a week in early January belongs to the previous one.

```js
import { isoWeek, isoYear, isoWeekAndYear, fromIsoWeek, weeksInIsoYear } from 'simple-iso-weeks';

const d = new Date(2020, 11, 31); // 31 Dec 2020
isoWeek(d);            // 1
isoYear(d);            // 2021
isoWeekAndYear(d);     // { week: 1, year: 2021 }

weeksInIsoYear(2020);  // 53
weeksInIsoYear(2021);  // 52

fromIsoWeek(2021, 1);  // Date for Monday, 28 Dec 2020
fromIsoWeek(2021, 53); // Date for Monday, 27 Dec 2021
```

## Why

`Date#getWeek()` does not exist. Every week-number implementation re-implements the same Thursday-determination rule, and most get the edge cases wrong because they test only mid-year dates. This library exists to provide one small, dependency-free module that computes ISO week numbers, week-numbering years, and the inverse mapping from `(year, week)` back to a Date, with the year-boundary cases tested rather than hoped for.

The trade-off: all computation is in local time. There is no timezone parameter. If your dates are UTC, construct them with `Date.UTC` and the results are consistent; if you need wall-clock semantics in a specific zone, normalize to local time yourself before calling these functions.

## Edge cases

The awkward edges are at year boundaries: 31 December 2020 is week 1 of 2021, and 1 January 2016 is week 53 of 2015. ISO-8601 assigns a week to the year that owns its Thursday, so weeks near January 1 frequently belong to the adjacent year. `fromIsoWeek` mirrors this: the Monday of ISO week 1 of 2021 is 28 December 2020.

## Running the tests

```sh
node --test
```
