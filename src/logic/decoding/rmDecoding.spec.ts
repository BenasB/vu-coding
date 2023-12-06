import { createBinaryString } from '../../utils/type-utils';
import { Matrix } from '../math/matrix';
import { reedMullerControlMatrix, reedMullerDecode } from './rmDecoding';

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

describe('reedMullerDecode', () => {
  const controlMatrices: Matrix[] = [
    [
      [1, 1, 0, 0, 0, 0, 0, 0],
      [1, -1, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 0, 0, 0, 0],
      [0, 0, 1, -1, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 0, 0],
      [0, 0, 0, 0, 1, -1, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 0, 0, 1, -1],
    ],
    [
      [1, 0, 1, 0, 0, 0, 0, 0],
      [0, 1, 0, 1, 0, 0, 0, 0],
      [1, 0, -1, 0, 0, 0, 0, 0],
      [0, 1, 0, -1, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 1, 0],
      [0, 0, 0, 0, 0, 1, 0, 1],
      [0, 0, 0, 0, 1, 0, -1, 0],
      [0, 0, 0, 0, 0, 1, 0, -1],
    ],
    [
      [1, 0, 0, 0, 1, 0, 0, 0],
      [0, 1, 0, 0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, -1, 0, 0, 0],
      [0, 1, 0, 0, 0, -1, 0, 0],
      [0, 0, 1, 0, 0, 0, -1, 0],
      [0, 0, 0, 1, 0, 0, 0, -1],
    ],
  ];

  it('decodes single RM(1, 3)', () => {
    expect(
      reedMullerDecode(createBinaryString('10101011'), controlMatrices, 3),
    ).toEqual('1100');
    expect(
      reedMullerDecode(createBinaryString('10001111'), controlMatrices, 3),
    ).toEqual('0001');
  });

  it('decodes multiple RM(1, 3)', () => {
    expect(
      reedMullerDecode(
        createBinaryString('1010101110001111'),
        controlMatrices,
        3,
      ),
    ).toEqual('11000001');
    expect(
      reedMullerDecode(
        createBinaryString('1000111110101011'),
        controlMatrices,
        3,
      ),
    ).toEqual('00011100');
  });
});
