import { Matrix, identityMatrix, kroneckerProduct } from '../math/matrix';

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
