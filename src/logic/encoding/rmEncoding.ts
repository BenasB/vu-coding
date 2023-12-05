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
  generationMatrix: Matrix,
) => BinaryString = (input, generationMatrix) => {
  return createBinaryString(
    multiply(binaryStringToMatrix(input), generationMatrix)[0]
      .map(x => x % 2) // Over F2
      .reduce<string>((acc, cur) => acc + cur.toString(), ''),
  );
};
