import { createBinaryString } from '../utils/type-utils';
import { BinaryString } from '../utils/types';
import {
  reedMullerControlMatrix,
  reedMullerDecode,
} from './decoding/rmDecoding';
import {
  reedMullerEncode,
  reedMullerGenerationMatrix,
} from './encoding/rmEncoding';
import { Matrix } from './math/matrix';

// A value that gets encoded, must be decoded to the same value
describe('reedMuller dogfood', () => {
  it('RM(1, 3) example 1', () => {
    const m = 3;
    const generationMatrix: Matrix = reedMullerGenerationMatrix(1, m);
    const controlMatrices: Matrix[] = [...(Array(m) as undefined[])].map(
      (_, i) => reedMullerControlMatrix(i + 1, m),
    );

    const input: BinaryString = createBinaryString('11011101111011111011');
    expect(
      reedMullerDecode(
        reedMullerEncode(input, m, generationMatrix),
        controlMatrices,
        m,
      ),
    ).toEqual(input);
  });
});
