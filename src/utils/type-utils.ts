import { BinaryString } from './types';

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
      .map<string>(str => str.padStart(16, '0')) // default encoding is UTF-16 so padding is needed
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
