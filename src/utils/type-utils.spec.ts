import {
  arrayBufferToBinaryString,
  binaryStringToString,
  binaryStringToText,
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
  it('converts multiple chars', () => {
    const binary = textToBinaryString('ab');
    const charOne = binary.slice(0, binary.length / 2);
    const charTwo = binary.slice(binary.length / 2);
    const aInBinary: BinaryString = ['1', '1', '0', '0', '0', '0', '1'];
    const bInBinary: BinaryString = ['1', '1', '0', '0', '0', '1', '0'];
    expect(charOne.slice(-aInBinary.length)).toEqual<BinaryString>(aInBinary);
    expect(charTwo.slice(-bInBinary.length)).toEqual<BinaryString>(bInBinary);
  });
});

describe('binaryStringToText', () => {
  it('converts empty', () => {
    expect(binaryStringToText([])).toBe('');
  });
  it('expects the input to be padded', () => {
    expect(() => binaryStringToText(['0'])).toThrowError();
  });
  it('converts single char', () => {
    const aInBinary: BinaryString = [
      '0',
      '0',
      '0',
      '0',
      '0',
      '0',
      '0',
      '0',
      '0',
      '1',
      '1',
      '0',
      '0',
      '0',
      '0',
      '1',
    ];
    expect(binaryStringToText(aInBinary)).toBe('a');
  });
});

describe('arrayBufferToBinaryString', () => {
  it('converts empty', () => {
    expect(arrayBufferToBinaryString(new ArrayBuffer(0), 1)).toEqual([]);
  });
  it('converts single', () => {
    expect(arrayBufferToBinaryString(new Uint8Array([0]), 1)).toEqual(['0']);
    expect(arrayBufferToBinaryString(new Uint8Array([1]), 1)).toEqual(['1']);
    expect(arrayBufferToBinaryString(new Uint8Array([2]), 2)).toEqual([
      '1',
      '0',
    ]);
    expect(arrayBufferToBinaryString(new Uint8Array([255]), 8)).toEqual([
      '1',
      '1',
      '1',
      '1',
      '1',
      '1',
      '1',
      '1',
    ]);
  });
  it('converts multiple', () => {
    expect(
      arrayBufferToBinaryString(new Uint8Array([0, 1, 0, 1, 0, 0]), 1),
    ).toEqual(['0', '1', '0', '1', '0', '0']);
    expect(arrayBufferToBinaryString(new Uint8Array([2, 3]), 4)).toEqual([
      '0',
      '0',
      '1',
      '0',
      '0',
      '0',
      '1',
      '1',
    ]);
  });
  it('handles different byte sizes', () => {
    expect(arrayBufferToBinaryString(new Uint8Array([0]), 1)).toHaveLength(1);
    expect(arrayBufferToBinaryString(new Uint8Array([1]), 3)).toHaveLength(3);
    expect(arrayBufferToBinaryString(new Uint8Array([127, 0]), 8)).toHaveLength(
      16,
    );
  });
});
