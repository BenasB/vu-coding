import { Matrix, identityMatrix, kroneckerProduct, multiply } from './matrix';

const emptyMatrix: Matrix = [[]];

describe('identityMatrix', () => {
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
    expect(kroneckerProduct(emptyMatrix, emptyMatrix)).toEqual<Matrix>([]);
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

describe('multiply', () => {
  it('1x1 matrices', () => {
    expect(multiply([[2]], [[5]])).toEqual<Matrix>([[10]]);
    expect(multiply([[5]], [[2]])).toEqual<Matrix>([[10]]);
  });
  it('Square matrices', () => {
    expect(
      multiply(
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
      [19, 22],
      [43, 50],
    ]);
  });
  it('Rectangle matrices', () => {
    expect(
      multiply(
        [
          [5, 4, 3],
          [2, 1, 5],
          [44, 1, 5],
          [4, 0, 6],
          [20, 2, 6],
        ],
        [
          [13, 2],
          [4, 9],
          [31, 2],
        ],
      ),
    ).toEqual<Matrix>([
      [174, 52],
      [185, 23],
      [731, 107],
      [238, 20],
      [454, 70],
    ]);
  });
  it('Matrix with negative numbers', () => {
    expect(
      multiply(
        [
          [1, 3, -5],
          [8, -11, 3],
        ],
        [[0], [2], [-4]],
      ),
    ).toEqual<Matrix>([[26], [-34]]);
  });
});
