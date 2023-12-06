import { createBinaryString } from '../../utils/type-utils';
import { BinaryString } from '../../utils/types';
import { Matrix } from '../math/matrix';
import { reedMullerEncode, reedMullerGenerationMatrix } from './rmEncoding';

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

describe('reedMullerEncode', () => {
  it('Encodes all RM(1,3) possible values correctly', () => {
    // RM(1, 3)
    const generationMatrix: Matrix = [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 0, 1, 0, 1, 0, 1],
      [0, 0, 1, 1, 0, 0, 1, 1],
      [0, 0, 0, 0, 1, 1, 1, 1],
    ];
    const inputs: BinaryString[] = [
      '0000',
      '0001',
      '0010',
      '0100',
      '0011',
      '0101',
      '0110',
      '0111',
      '1000',
      '1001',
      '1010',
      '1100',
      '1011',
      '1101',
      '1110',
      '1111',
    ].map(createBinaryString);
    const expectedOutputs: BinaryString[] = [
      '00000000',
      '00001111',
      '00110011',
      '01010101',
      '00111100',
      '01011010',
      '01100110',
      '01101001',
      '11111111',
      '11110000',
      '11001100',
      '10101010',
      '11000011',
      '10100101',
      '10011001',
      '10010110',
    ].map(createBinaryString);

    inputs.forEach((x, i) =>
      expect(reedMullerEncode(x, 3, generationMatrix)).toEqual(
        expectedOutputs[i],
      ),
    );
  });
  it('encodes several pieces and puts it back together', () => {
    // RM(1, 3)
    const generationMatrix: Matrix = [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 0, 1, 0, 1, 0, 1],
      [0, 0, 1, 1, 0, 0, 1, 1],
      [0, 0, 0, 0, 1, 1, 1, 1],
    ];

    expect(
      reedMullerEncode(createBinaryString('000111011001'), 3, generationMatrix),
    ).toEqual('000011111010010111110000');
  });
});
