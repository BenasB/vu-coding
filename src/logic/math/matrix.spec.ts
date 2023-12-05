import { Matrix, identityMatrix, kroneckerProduct } from './matrix';

describe('identityMatrix', () => {
  it('n = 0', () => {
    expect(identityMatrix(0)).toEqual<Matrix>([]);
  });
  it('n = 1', () => {
    expect(identityMatrix(1)).toEqual<Matrix>([[1]]);
  });
  it('n = 2', () => {
    expect(identityMatrix(2)).toEqual<Matrix>([
      [1, 0],
      [0, 1],
    ]);
  });
  it('n = 3', () => {
    expect(identityMatrix(3)).toEqual<Matrix>([
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ]);
  });
});

describe('kroneckerProduct', () => {
  it('Empty matrices', () => {
    expect(kroneckerProduct([[]], [[]])).toEqual<Matrix>([]);
  });
  it('1x1 matrices', () => {
    expect(kroneckerProduct([[2]], [[5]])).toEqual<Matrix>([[10]]);
    expect(kroneckerProduct([[5]], [[2]])).toEqual<Matrix>([[10]]);
  });
  it('Example 1', () => {
    expect(
      kroneckerProduct(
        [
          [1, 2],
          [3, 4],
        ],
        [
          [5, 6],
          [7, 8],
        ],
      ),
    ).toEqual<Matrix>([
      [5, 6, 10, 12],
      [7, 8, 14, 16],
      [15, 18, 20, 24],
      [21, 24, 28, 32],
    ]);
  });
  it('Example 2', () => {
    const h: Matrix = [
      [1, 1],
      [1, -1],
    ];
    const i: Matrix = [
      [1, 0],
      [0, 1],
    ];
    expect(kroneckerProduct(i, h)).toEqual<Matrix>([
      [1, 1, 0, 0],
      [1, -1, 0, 0],
      [0, 0, 1, 1],
      [0, 0, 1, -1],
    ]);
    expect(kroneckerProduct(h, i)).toEqual<Matrix>([
      [1, 0, 1, 0],
      [0, 1, 0, 1],
      [1, 0, -1, 0],
      [0, 1, 0, -1],
    ]);
  });
  it('Example 3', () => {
    const h: Matrix = [
      [1, 1],
      [1, -1],
    ];
    const i: Matrix = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];
    expect(kroneckerProduct(i, h)).toEqual<Matrix>([
      [1, 1, 0, 0, 0, 0, 0, 0],
      [1, -1, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 0, 0, 0, 0],
      [0, 0, 1, -1, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 0, 0],
      [0, 0, 0, 0, 1, -1, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 0, 0, 1, -1],
    ]);
  });
});
