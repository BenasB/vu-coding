import { BinaryString } from './types';

export const binaryStringToString: (input: BinaryString) => string = input =>
  input.reduce<string>(
    (accumulator, currentValue) => accumulator.concat(currentValue),
    '',
  );
