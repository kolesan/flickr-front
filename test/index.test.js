import { sum } from '../src/public/index';

test('sum function works', () => {
  expect(sum(1, 2)).toBe(3);
});