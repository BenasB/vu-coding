import repeatEncode from './repeatEncoding';

describe('repeatEncode', () => {
  it('encodes none with empty input', () => {
    expect(repeatEncode([], 3)).toHaveLength(0);
  });
  it('encodes none with 0 n', () => {
    expect(repeatEncode(['1', '0', '1'], 0)).toHaveLength(0);
  });
  it('encodes single bit', () => {
    expect(repeatEncode(['0'], 3)).toEqual(['0', '0', '0']);
  });
  it('encodes multiple bits', () => {
    expect(repeatEncode(['1', '0', '0', '1', '1'], 3)).toEqual([
      '1',
      '1',
      '1',
      '0',
      '0',
      '0',
      '0',
      '0',
      '0',
      '1',
      '1',
      '1',
      '1',
      '1',
      '1',
    ]);
  });
});
