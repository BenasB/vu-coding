import {
  binaryStringToVector,
  createBinaryString,
} from '../../utils/type-utils';
import { BinaryString } from '../../utils/types';
import {
  Matrix,
  identityMatrix,
  kroneckerProduct,
  multiply,
} from '../math/matrix';

const H: Matrix = [
  [1, 1],
  [1, -1],
];

export const reedMullerControlMatrix: (i: number, m: number) => Matrix = (
  i,
  m,
) =>
  kroneckerProduct(
    kroneckerProduct(identityMatrix(Math.pow(2, m - i)), H),
    identityMatrix(Math.pow(2, i - 1)),
  );

export const reedMullerDecode: (
  input: BinaryString,
  controlMatrices: Matrix[],
  m: number,
) => BinaryString = (input, controlMatrices, m) => {
  const vectorLength = Math.pow(2, m);

  if (input.length % vectorLength !== 0)
    throw new Error(
      `Input length ${input.length} is not divisible by ${vectorLength}`,
    );

  const inputArray = binaryStringToVector(input);

  // Chunk vectors into pieces of vectorLength
  const vectors = [
    ...(Array(Math.ceil(inputArray.length / vectorLength)) as undefined[]),
  ]
    .map((_, index) => index * vectorLength)
    .map<number[]>(begin => inputArray.slice(begin, begin + vectorLength));

  const decodedVectors = vectors
    .map(w => w.map(x => (x === 0 ? -1 : x))) // Replace all 0s with -1s
    .map(
      w =>
        controlMatrices.reduce<Matrix>((wPrev, h) => multiply(wPrev, h), [w]), // Multiply by the control matrices
    )
    .map(wmMatrix => {
      const [wm] = wmMatrix;
      const largestIndex = wm.reduce(
        (iMax, x, i, arr) => (Math.abs(x) > Math.abs(arr[iMax]) ? i : iMax),
        0,
      );

      const v = largestIndex
        .toString(2) // To binary representation
        .padStart(m, '0') // Pad 0s
        .split('')
        .reverse() // Low order digits first
        .map(x => parseInt(x));

      return [wm[largestIndex] >= 0 ? 1 : 0, ...v]; // Determine the first bit based on the sign of the largest wm element
    });

  const decodedVectorString = decodedVectors.reduce<string>(
    (acc, cur) =>
      acc + cur.reduce<string>((acc2, cur2) => acc2 + cur2.toString(), ''),
    '',
  );

  return createBinaryString(decodedVectorString);
};
