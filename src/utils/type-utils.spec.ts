import {
  binaryStringToString,
  stringToBinaryString,
  textToBinaryString,
} from './type-utils';
import { BinaryString } from './types';

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

describe('stringToBinaryString', () => {
  it('converts empty', () => {
    expect(stringToBinaryString('')).toEqual<BinaryString>([]);
  });
  it('converts single', () => {
    expect(stringToBinaryString('1')).toEqual<BinaryString>(['1']);
    expect(stringToBinaryString('0')).toEqual<BinaryString>(['0']);
  });
  it('converts multiplpe', () => {
    expect(stringToBinaryString('01')).toEqual<BinaryString>(['0', '1']);
    expect(stringToBinaryString('1001011')).toEqual<BinaryString>([
      '1',
      '0',
      '0',
      '1',
      '0',
      '1',
      '1',
    ]);
  });
  it('throws on non binary character', () => {
    expect(() => stringToBinaryString('a')).toThrowError();
    expect(() => stringToBinaryString('0110g11')).toThrowError();
    expect(() => stringToBinaryString('011011-')).toThrowError();
  });
});

describe('textToBinaryString', () => {
  it('converts empty', () => {
    expect(textToBinaryString('')).toEqual<BinaryString>([]);
  });
  it('converts single char', () => {
    const aInBinary: BinaryString = ['1', '1', '0', '0', '0', '0', '1'];
    expect(
      textToBinaryString('a').slice(-aInBinary.length),
    ).toEqual<BinaryString>(aInBinary);
  });
  it('pads for UTF-16', () => {
    expect(textToBinaryString('a')).toHaveLength(16);
  });
  it('converts a non ASCII char', () => {
    const charInBinary: BinaryString = [
      '1',
      '0',
      '0',
      '0',
      '0',
      '1',
      '1',
      '0',
      '1',
    ];
    expect(
      textToBinaryString('č').slice(-charInBinary.length),
    ).toEqual<BinaryString>(charInBinary);
  });
});
