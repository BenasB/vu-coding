import { binaryStringToString } from './type-utils';

describe('binaryStringToString', () => {
  it('converts empty', () => {
    expect(binaryStringToString([])).toBe('');
  });
  it('converts single', () => {
    expect(binaryStringToString(['0'])).toBe('0');
    expect(binaryStringToString(['1'])).toBe('1');
  });
  it('converts multiple', () => {
    expect(binaryStringToString(['0', '1', '0', '0', '1'])).toBe('01001');
  });
});
