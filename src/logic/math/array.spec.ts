import { chunk } from './array';

describe('chunk', () => {
  it('0 length input', () => {
    expect(chunk([], 2)).toEqual([]);
  });
  it('1 length input, 1 length chunk', () => {
    expect(chunk(['a'], 1)).toEqual([['a']]);
  });
  it('4 length input, 2 length chunk', () => {
    expect(chunk(['a', 'b', 'c', 'd'], 2)).toEqual([
      ['a', 'b'],
      ['c', 'd'],
    ]);
  });
  it('4 length input, 3 length chunk', () => {
    expect(chunk(['a', 'b', 'c', 'd'], 3)).toEqual([['a', 'b', 'c'], ['d']]);
  });
});
