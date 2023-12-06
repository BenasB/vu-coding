import {
  binaryStringToMatrix,
  createBinaryString,
} from '../../utils/type-utils';
import { BinaryString } from '../../utils/types';
import { Matrix, multiply } from '../math/matrix';

export const reedMullerGenerationMatrix: (r: number, m: number) => Matrix = (
  r,
  m,
) => {
  if (r === 0) return [Array(Math.pow(2, m)).fill(1) as number[]]; // [[11...1]] with 2^m elements

  if (r === m) {
    const prevG = reedMullerGenerationMatrix(m - 1, m);

    return [
      ...prevG,
      (Array(prevG[0].length - 1).fill(0) as number[]).concat(1), // [0...01]
    ];
  }

  const tm = reedMullerGenerationMatrix(r, m - 1); // Top left and top right matrices
  const brm = reedMullerGenerationMatrix(r - 1, m - 1); // Bottom right matrix

  const top = tm.map(row => row.concat(row));
  const bottom = brm.map(row =>
    (Array(tm[0].length).fill(0) as number[]).concat(row),
  );

  return [...top, ...bottom];
};

export const reedMullerEncode: (
  input: BinaryString,
  m: number,
  generationMatrix: Matrix,
) => BinaryString = (input, m, generationMatrix) => {
  const inputArray = binaryStringToMatrix(input)[0];
  const vectorLength = m + 1;
  const vectors = [
    ...(Array(Math.ceil(inputArray.length / vectorLength)) as undefined[]),
  ]
    .map((_, index) => index * vectorLength)
    .map<number[]>(begin => inputArray.slice(begin, begin + vectorLength));

  const encodedVectorString = vectors
    .map(v => multiply([v], generationMatrix)[0])
    .map(v => v.map(x => x % 2))
    .reduce<string>(
      (acc, cur) =>
        acc + cur.reduce<string>((acc2, cur2) => acc2 + cur2.toString(), ''),
      '',
    );

  return createBinaryString(encodedVectorString);
};
