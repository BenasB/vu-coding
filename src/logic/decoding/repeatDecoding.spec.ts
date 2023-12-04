import { createBinaryString } from '../../utils/type-utils';
import { BinaryString } from '../../utils/types';
import repeatDecode from './repeatDecoding';

describe('repeatDecode', () => {
  it('decodes nothing', () => {
    expect(repeatDecode(createBinaryString(''), 3)).toEqual<BinaryString>(
      createBinaryString(''),
    );
  });

  it('throws error when input length is not divisible by n', () => {
    expect(() => repeatDecode(createBinaryString('010'), 2)).toThrowError();
  });

  it('decodes same as input when n is 1', () => {
    expect(repeatDecode(createBinaryString('1011'), 1)).toEqual<BinaryString>(
      createBinaryString('1011'),
    );
  });

  it('prefers 0 when amount of 1s and 0s is equal', () => {
    expect(repeatDecode(createBinaryString('01'), 2)).toEqual<BinaryString>(
      createBinaryString('0'),
    );
  });

  it('decodes single correct bit', () => {
    expect(repeatDecode(createBinaryString('111'), 3)).toEqual<BinaryString>(
      createBinaryString('1'),
    );
    expect(repeatDecode(createBinaryString('000'), 3)).toEqual<BinaryString>(
      createBinaryString('0'),
    );
  });

  it('decodes single noise bit', () => {
    expect(repeatDecode(createBinaryString('011'), 3)).toEqual<BinaryString>(
      createBinaryString('1'),
    );
    expect(repeatDecode(createBinaryString('101'), 3)).toEqual<BinaryString>(
      createBinaryString('1'),
    );
    expect(repeatDecode(createBinaryString('110'), 3)).toEqual<BinaryString>(
      createBinaryString('1'),
    );

    expect(repeatDecode(createBinaryString('100'), 3)).toEqual<BinaryString>(
      createBinaryString('0'),
    );
    expect(repeatDecode(createBinaryString('010'), 3)).toEqual<BinaryString>(
      createBinaryString('0'),
    );
    expect(repeatDecode(createBinaryString('001'), 3)).toEqual<BinaryString>(
      createBinaryString('0'),
    );
  });

  it('decodes multiple correct bits', () => {
    expect(
      repeatDecode(createBinaryString('111000111000000'), 3),
    ).toEqual<BinaryString>(createBinaryString('10100'));
  });

  it('decodes multiple noise bits', () => {
    expect(
      repeatDecode(createBinaryString('100101111000100'), 3),
    ).toEqual<BinaryString>(createBinaryString('01100'));
  });
});
