import { BinaryString } from './types';

export const UTF16_CHAR_SIZE = 16;

export const binaryStringToString: (input: BinaryString) => string = input =>
  input.reduce<string>(
    (accumulator, currentValue) => accumulator.concat(currentValue),
    '',
  );

export const textToBinaryString: (input: string) => BinaryString = (
  input: string,
) =>
  stringToBinaryString(
    input
      .split('')
      .map<string>(char => char.charCodeAt(0).toString(2))
      .map<string>(str => str.padStart(UTF16_CHAR_SIZE, '0')) // default encoding is UTF-16 so padding is needed
      .join(''),
  );

export const stringToBinaryString: (input: string) => BinaryString = (
  input: string,
) =>
  input.split('').reduce<BinaryString>((acc, cur) => {
    if (cur !== '1' && cur !== '0')
      throw new Error(`Encountered '${cur}' when parsing a binary string`);

    return acc.concat(cur === '1' ? '1' : '0');
  }, []);

export const binaryStringToText: (input: BinaryString) => string = input => {
  if (input.length % UTF16_CHAR_SIZE !== 0)
    throw new Error(
      `Binary string of lentgth '${input.length}' could not be split into chunks of 16`,
    );

  const str = binaryStringToString(input);
  const stringChars = [
    ...(Array(Math.ceil(str.length / UTF16_CHAR_SIZE)) as undefined[]),
  ]
    .map((_, index) => index * UTF16_CHAR_SIZE)
    .map<string>(begin => str.slice(begin, begin + UTF16_CHAR_SIZE));

  return stringChars.map(x => String.fromCharCode(parseInt(x, 2))).join('');
};
