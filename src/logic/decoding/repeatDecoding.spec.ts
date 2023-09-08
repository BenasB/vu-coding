import repeatDecode from './repeatDecoding';

describe('repeatDecode', () => {
  it('decodes nothing', () => {
    expect(repeatDecode([], 3)).toEqual([]);
  });

  it('throws error when input length is not divisible by n', () => {
    expect(() => repeatDecode(['0', '1', '0'], 2)).toThrowError();
  });

  it('decodes same as input when n is 1', () => {
    expect(repeatDecode(['1', '0', '1', '1'], 1)).toEqual(['1', '0', '1', '1']);
  });

  it('prefers 0 when amount of 1s and 0s is equal', () => {
    expect(repeatDecode(['0', '1'], 2)).toEqual(['0']);
  });

  it('decodes single correct bit', () => {
    expect(repeatDecode(['1', '1', '1'], 3)).toEqual(['1']);
    expect(repeatDecode(['0', '0', '0'], 3)).toEqual(['0']);
  });

  it('decodes single noise bit', () => {
    expect(repeatDecode(['0', '1', '1'], 3)).toEqual(['1']);
    expect(repeatDecode(['1', '0', '1'], 3)).toEqual(['1']);
    expect(repeatDecode(['1', '1', '0'], 3)).toEqual(['1']);

    expect(repeatDecode(['1', '0', '0'], 3)).toEqual(['0']);
    expect(repeatDecode(['0', '1', '0'], 3)).toEqual(['0']);
    expect(repeatDecode(['0', '0', '1'], 3)).toEqual(['0']);
  });

  it('decodes multiple correct bits', () => {
    expect(
      repeatDecode(
        [
          '1',
          '1',
          '1',
          '0',
          '0',
          '0',
          '1',
          '1',
          '1',
          '0',
          '0',
          '0',
          '0',
          '0',
          '0',
        ],
        3,
      ),
    ).toEqual(['1', '0', '1', '0', '0']);
  });

  it('decodes multiple noise bits', () => {
    expect(
      repeatDecode(
        [
          '1',
          '0',
          '0',
          '1',
          '0',
          '1',
          '1',
          '1',
          '1',
          '0',
          '0',
          '0',
          '1',
          '0',
          '0',
        ],
        3,
      ),
    ).toEqual(['0', '1', '1', '0', '0']);
  });
});
