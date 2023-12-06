import {
  arrayBufferToBinaryString,
  binaryStringToArrayBuffer,
  binaryStringToVector,
  binaryStringToText,
  createBinaryString,
  textToBinaryString,
} from './type-utils';
import { BinaryString } from './types';

describe('textToBinaryString', () => {
  it('converts empty', () => {
    expect(textToBinaryString('')).toEqual<BinaryString>(
      createBinaryString(''),
    );
  });
  it('converts single char', () => {
    const aInBinary: BinaryString = createBinaryString('1100001');
    expect(
      textToBinaryString('a').slice(-aInBinary.length),
    ).toEqual<BinaryString>(aInBinary);
  });
  it('pads for UTF-16', () => {
    expect(textToBinaryString('a')).toHaveLength(16);
  });
  it('converts a non ASCII char', () => {
    const charInBinary: BinaryString = createBinaryString('100001101');
    expect(
      textToBinaryString('č').slice(-charInBinary.length),
    ).toEqual<BinaryString>(charInBinary);
  });
  it('converts multiple chars', () => {
    const binary = textToBinaryString('ab');
    const charOne = binary.slice(0, binary.length / 2);
    const charTwo = binary.slice(binary.length / 2);
    const aInBinary: BinaryString = createBinaryString('1100001');
    const bInBinary: BinaryString = createBinaryString('1100010');
    expect(charOne.slice(-aInBinary.length)).toEqual<BinaryString>(aInBinary);
    expect(charTwo.slice(-bInBinary.length)).toEqual<BinaryString>(bInBinary);
  });
});

describe('binaryStringToText', () => {
  it('converts empty', () => {
    expect(binaryStringToText(createBinaryString(''))).toBe('');
  });
  it('expects the input to be padded', () => {
    expect(() => binaryStringToText(createBinaryString('0'))).toThrowError();
  });
  it('converts single char', () => {
    const aInBinary: BinaryString = createBinaryString('0000000001100001');
    expect(binaryStringToText(aInBinary)).toBe('a');
  });
});

describe('arrayBufferToBinaryString', () => {
  it('converts empty', () => {
    expect(arrayBufferToBinaryString(new ArrayBuffer(0), 1)).toEqual(
      createBinaryString(''),
    );
  });
  it('converts single', () => {
    expect(arrayBufferToBinaryString(new Uint8Array([0]), 1)).toEqual(
      createBinaryString('0'),
    );
    expect(arrayBufferToBinaryString(new Uint8Array([1]), 1)).toEqual(
      createBinaryString('1'),
    );
    expect(arrayBufferToBinaryString(new Uint8Array([2]), 2)).toEqual(
      createBinaryString('10'),
    );
    expect(arrayBufferToBinaryString(new Uint8Array([255]), 8)).toEqual(
      createBinaryString('11111111'),
    );
  });
  it('converts multiple', () => {
    expect(
      arrayBufferToBinaryString(new Uint8Array([0, 1, 0, 1, 0, 0]), 1),
    ).toEqual(createBinaryString('010100'));
    expect(arrayBufferToBinaryString(new Uint8Array([2, 3]), 4)).toEqual(
      createBinaryString('00100011'),
    );
  });
  it('handles different byte sizes', () => {
    expect(arrayBufferToBinaryString(new Uint8Array([0]), 1)).toHaveLength(1);
    expect(arrayBufferToBinaryString(new Uint8Array([1]), 3)).toHaveLength(3);
    expect(arrayBufferToBinaryString(new Uint8Array([127, 0]), 8)).toHaveLength(
      16,
    );
  });
});

describe('binaryStringToArrayBuffer', () => {
  it('converts empty', () => {
    expect(binaryStringToArrayBuffer(createBinaryString(''), 1)).toEqual(
      new Uint8Array(0),
    );
  });
  it('converts single', () => {
    expect(binaryStringToArrayBuffer(createBinaryString('0'), 1)).toEqual(
      new Uint8Array([0]),
    );
    expect(binaryStringToArrayBuffer(createBinaryString('1'), 1)).toEqual(
      new Uint8Array([1]),
    );
    expect(binaryStringToArrayBuffer(createBinaryString('10'), 2)).toEqual(
      new Uint8Array([2]),
    );
    expect(
      binaryStringToArrayBuffer(createBinaryString('11111111'), 8),
    ).toEqual(new Uint8Array([255]));
  });
  it('converts multiple', () => {
    expect(binaryStringToArrayBuffer(createBinaryString('010100'), 1)).toEqual(
      new Uint8Array([0, 1, 0, 1, 0, 0]),
    );
    expect(
      binaryStringToArrayBuffer(createBinaryString('00100011'), 4),
    ).toEqual(new Uint8Array([2, 3]));
  });
  it('converts multiple', () => {
    expect(binaryStringToArrayBuffer(createBinaryString('010100'), 1)).toEqual(
      new Uint8Array([0, 1, 0, 1, 0, 0]),
    );
    expect(
      binaryStringToArrayBuffer(createBinaryString('00100011'), 4),
    ).toEqual(new Uint8Array([2, 3]));
  });
  it('handles different byte sizes', () => {
    expect(binaryStringToArrayBuffer(createBinaryString('0'), 1)).toHaveLength(
      1,
    );
    expect(
      binaryStringToArrayBuffer(createBinaryString('111'), 3),
    ).toHaveLength(1);
    expect(
      binaryStringToArrayBuffer(createBinaryString('1111111111111111'), 8),
    ).toHaveLength(2);
  });
});

describe('binaryStringToMatrix', () => {
  it('converts empty', () => {
    expect(binaryStringToVector(createBinaryString(''))).toEqual([]);
  });
  it('converts single', () => {
    expect(binaryStringToVector(createBinaryString('0'))).toEqual([0]);
    expect(binaryStringToVector(createBinaryString('1'))).toEqual([1]);
  });
  it('converts multiple', () => {
    expect(binaryStringToVector(createBinaryString('01100001'))).toEqual([
      0, 1, 1, 0, 0, 0, 0, 1,
    ]);
  });
});
