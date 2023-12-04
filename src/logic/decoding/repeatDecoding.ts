import { createBinaryString } from '../../utils/type-utils';
import { BinaryString } from '../../utils/types';

const repeatDecode: (input: BinaryString, n: number) => BinaryString = (
  input,
  n,
) => {
  if (input.length % n !== 0)
    throw new Error(`Input length ${input.length} is not divisible by ${n}`);

  const str = [...(Array(Math.ceil(input.length / n)) as undefined[])]
    .map((_, index) => index * n)
    .map<string>(begin => input.slice(begin, begin + n)) // Generate a 2D array of the input chunked by n length
    .reduce<string>((acc, cur) => {
      const countOfOnes = (cur.match(/1/g) ?? []).length;

      // Choose the majority
      // On equal number of 1s and 0s (could happen when n is even) it chooses 0
      return acc.concat(countOfOnes > Math.floor(n / 2) ? '1' : '0');
    }, '');

  return createBinaryString(str);
};

export default repeatDecode;
