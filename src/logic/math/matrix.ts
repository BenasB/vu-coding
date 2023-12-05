export type Matrix = number[][];

export const identityMatrix: (n: number) => Matrix = n =>
  [...(Array(n) as undefined[])].map((_, i, a) => a.map(() => +!i--));

export const kroneckerProduct: (a: Matrix, b: Matrix) => Matrix = (a, b) => {
  const rowsA = a.length;
  const rowsB = b.length;

  const colsA = a[0].length;
  const colsB = b[0].length;

  const result: Matrix = [];

  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsA; j++) {
      for (let k = 0; k < rowsB; k++) {
        for (let l = 0; l < colsB; l++) {
          if (!result[i * rowsB + k]) {
            result[i * rowsB + k] = [];
          }
          result[i * rowsB + k][j * colsB + l] = a[i][j] * b[k][l] + 0; // + 0 to avoid JS negative zeros
        }
      }
    }
  }

  return result;
};

export const multiply: (a: Matrix, b: Matrix) => Matrix = (a, b) => {
  const rowsA = a.length;
  const colsA = a[0].length;
  const rowsB = b.length;
  const colsB = b[0].length;

  if (colsA !== rowsB) {
    throw Error(
      `Matrices cannot be multiplied. Incorrect dimensions. ${colsA} and ${rowsB}`,
    );
  }

  // Create 2D array and fill it with 0
  const result: Matrix = Array.from(
    { length: rowsA },
    () => Array(colsB).fill(0) as number[],
  );

  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsB; j++) {
      for (let k = 0; k < colsA; k++) {
        result[i][j] += a[i][k] * b[k][j];
      }
    }
  }

  return result;
};
