import { BinaryString } from '../../utils/types';

const repeatDecode: (input: BinaryString, n: number) => BinaryString = (
  input,
  n,
) => {
  if (input.length % n !== 0)
    throw new Error(`Input length ${input.length} is not divisible by ${n}`);

  return [...(Array(Math.ceil(input.length / n)) as undefined[])]
    .map((_, index) => index * n)
    .map<BinaryString>(begin => input.slice(begin, begin + n)) // Generate a 2D array of the input chunked by n length
    .reduce<BinaryString>((acc, cur) => {
      const countOfOnes = cur.reduce(
        (acc2, cur2) => (cur2 === '1' ? acc2 + 1 : acc2),
        0,
      );

      // Choose the majority
      // On equal number of 1s and 0s (could happen when n is even) it chooses 0
      return acc.concat(countOfOnes > Math.floor(n / 2) ? '1' : '0');
    }, []);
};

export default repeatDecode;
