import { createBinaryString } from '../../utils/type-utils';
import { BinaryString } from '../../utils/types';

const repeatEncode: (input: BinaryString, n: number) => BinaryString = (
  input,
  n,
) =>
  createBinaryString(
    input
      .split('')
      .reduce<string>(
        (accumulator, currentValue) =>
          accumulator.concat(currentValue.repeat(n)),
        '',
      ),
  );

export default repeatEncode;
