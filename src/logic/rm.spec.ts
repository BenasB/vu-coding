import { createBinaryString } from '../utils/type-utils';
import {
  reedMullerControlMatrix,
  reedMullerDecode,
} from './decoding/rmDecoding';
import {
  reedMullerEncode,
  reedMullerGenerationMatrix,
} from './encoding/rmEncoding';
import { Matrix } from './math/matrix';
import fc from 'fast-check';

// This is a property test
// A value that gets encoded, must be decoded to the same value
test('reedMuller dogfood property check', () => {
  fc.assert(
    fc.property(fc.nat({ max: 9 }), r => {
      const m = r + 1; // m value will be [1; 10]
      const generationMatrix: Matrix = reedMullerGenerationMatrix(1, m);
      const controlMatrices: Matrix[] = [...(Array(m) as undefined[])].map(
        (_, i) => reedMullerControlMatrix(i + 1, m),
      );

      fc.assert(
        fc.property(
          fc.stringOf(fc.constantFrom('0', '1'), {
            maxLength: 10000,
            minLength: 1,
          }),
          input => {
            const paddedInput = input.padEnd(
              input.length + ((m + 1 - (input.length % (m + 1))) % (m + 1)),
              '0',
            );

            return expect(
              reedMullerDecode(
                reedMullerEncode(
                  createBinaryString(paddedInput),
                  m,
                  generationMatrix,
                ),
                controlMatrices,
                m,
              ),
            ).toEqual(paddedInput);
          },
        ),
        { numRuns: 20 },
      );
    }),
    { numRuns: 10 },
  );
});

test('reedMuller dogfood manual', () => {
  const m = 3;
  const generationMatrix: Matrix = reedMullerGenerationMatrix(1, m);
  const controlMatrices: Matrix[] = [...(Array(m) as undefined[])].map((_, i) =>
    reedMullerControlMatrix(i + 1, m),
  );
  const input = '011101110110111';
  const paddedInput = input.padEnd(
    input.length + ((m + 1 - (input.length % (m + 1))) % (m + 1)),
    '0',
  );
  expect(
    reedMullerDecode(
      reedMullerEncode(createBinaryString(paddedInput), m, generationMatrix),
      controlMatrices,
      m,
    ),
  ).toEqual(paddedInput);
});
