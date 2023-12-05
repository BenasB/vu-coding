import { reedMullerGenerationMatrix } from './rmEncoding';

describe('reedMullerGenerationMatrix', () => {
  it('(0,1)', () => {
    expect(reedMullerGenerationMatrix(0, 1)).toEqual([[1, 1]]);
  });
  it('(1,1)', () => {
    expect(reedMullerGenerationMatrix(1, 1)).toEqual([
      [1, 1],
      [0, 1],
    ]);
  });
  it('(1,2)', () => {
    expect(reedMullerGenerationMatrix(1, 2)).toEqual([
      [1, 1, 1, 1],
      [0, 1, 0, 1],
      [0, 0, 1, 1],
    ]);
  });
  it('(2,2)', () => {
    expect(reedMullerGenerationMatrix(2, 2)).toEqual([
      [1, 1, 1, 1],
      [0, 1, 0, 1],
      [0, 0, 1, 1],
      [0, 0, 0, 1],
    ]);
  });
  it('(1,3)', () => {
    expect(reedMullerGenerationMatrix(1, 3)).toEqual([
      [1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 0, 1, 0, 1, 0, 1],
      [0, 0, 1, 1, 0, 0, 1, 1],
      [0, 0, 0, 0, 1, 1, 1, 1],
    ]);
  });
});
