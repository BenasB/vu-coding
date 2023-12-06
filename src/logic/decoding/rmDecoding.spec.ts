import { Matrix } from '../math/matrix';
import { reedMullerControlMatrix } from './rmDecoding';

describe('reedMullerControlMatrix', () => {
  it('(1,2)', () => {
    expect(reedMullerControlMatrix(1, 2)).toEqual<Matrix>([
      [1, 1, 0, 0],
      [1, -1, 0, 0],
      [0, 0, 1, 1],
      [0, 0, 1, -1],
    ]);
  });
  it('(2,2)', () => {
    expect(reedMullerControlMatrix(2, 2)).toEqual<Matrix>([
      [1, 0, 1, 0],
      [0, 1, 0, 1],
      [1, 0, -1, 0],
      [0, 1, 0, -1],
    ]);
  });
  it('(1,3)', () => {
    expect(reedMullerControlMatrix(1, 3)).toEqual<Matrix>([
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
  it('(2,3)', () => {
    expect(reedMullerControlMatrix(2, 3)).toEqual<Matrix>([
      [1, 0, 1, 0, 0, 0, 0, 0],
      [0, 1, 0, 1, 0, 0, 0, 0],
      [1, 0, -1, 0, 0, 0, 0, 0],
      [0, 1, 0, -1, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 1, 0],
      [0, 0, 0, 0, 0, 1, 0, 1],
      [0, 0, 0, 0, 1, 0, -1, 0],
      [0, 0, 0, 0, 0, 1, 0, -1],
    ]);
  });
  it('(3,3)', () => {
    expect(reedMullerControlMatrix(3, 3)).toEqual<Matrix>([
      [1, 0, 0, 0, 1, 0, 0, 0],
      [0, 1, 0, 0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, -1, 0, 0, 0],
      [0, 1, 0, 0, 0, -1, 0, 0],
      [0, 0, 1, 0, 0, 0, -1, 0],
      [0, 0, 0, 1, 0, 0, 0, -1],
    ]);
  });
});
