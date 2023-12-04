import { BinaryString } from './types';

export const UTF16_CHAR_SIZE = 16;

export const textToBinaryString: (input: string) => BinaryString = (
  input: string,
) =>
  createBinaryString(
    input
      .split('')
      .map<string>(char => char.charCodeAt(0).toString(2))
      .map<string>(str => str.padStart(UTF16_CHAR_SIZE, '0')) // default encoding is UTF-16 so padding is needed
      .join(''),
  );

export const binaryStringToText: (input: BinaryString) => string = input => {
  if (input.length % UTF16_CHAR_SIZE !== 0)
    throw new Error(
      `Binary string of lentgth '${input.length}' could not be split into chunks of 16`,
    );

  const stringChars = [
    ...(Array(Math.ceil(input.length / UTF16_CHAR_SIZE)) as undefined[]),
  ]
    .map((_, index) => index * UTF16_CHAR_SIZE)
    .map<string>(begin => input.slice(begin, begin + UTF16_CHAR_SIZE));

  return stringChars.map(x => String.fromCharCode(parseInt(x, 2))).join('');
};

export const arrayBufferToBinaryString: (
  input: ArrayBuffer,
  byteLength: number,
) => BinaryString = (input, byteLength) =>
  createBinaryString(
    new Uint8Array(input).reduce(
      (str, byte) => str + byte.toString(2).padStart(byteLength, '0'),
      '',
    ),
  );

export const binaryStringToArrayBuffer: (
  input: BinaryString,
  byteLength: number,
) => ArrayBuffer = (input, byteLength) => {
  const stringBytes = input.match(new RegExp(`.{${byteLength}}`, 'g')) ?? [];
  const numBytes = stringBytes.map(s => Number.parseInt(s, 2));

  return Uint8Array.from(numBytes);
};

export const isBinaryString = (str: string): str is BinaryString =>
  str.length === 0 || (str.match(/\b[01]+\b/) ?? []).length > 0;

export const createBinaryString = (input: unknown): BinaryString => {
  if (typeof input !== 'string') {
    throw new Error('invalid input');
  }

  if (!isBinaryString(input)) {
    throw new Error('input is not a binary string');
  }

  return input;
};
