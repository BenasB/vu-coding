import { createBinaryString } from '../../utils/type-utils';
import { BinaryString } from '../../utils/types';
import repeatEncode from './repeatEncoding';

describe('repeatEncode', () => {
  it('encodes none with empty input', () => {
    expect(repeatEncode(createBinaryString(''), 3)).toHaveLength(0);
  });
  it('encodes none with 0 n', () => {
    expect(repeatEncode(createBinaryString('101'), 0)).toHaveLength(0);
  });
  it('encodes single bit', () => {
    expect(repeatEncode(createBinaryString('0'), 3)).toEqual<BinaryString>(
      createBinaryString('000'),
    );
  });
  it('encodes multiple bits', () => {
    expect(repeatEncode(createBinaryString('10011'), 3)).toEqual<BinaryString>(
      createBinaryString('111000000111111'),
    );
  });
});
