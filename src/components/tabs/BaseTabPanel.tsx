import {
  InputGroup,
  InputLeftAddon,
  Input,
  Tooltip,
  Button,
  FormErrorMessage,
  FormControl,
} from '@chakra-ui/react';
import React, { useEffect, useMemo, useState } from 'react';
import { binaryStringToString } from '../../utils/type-utils';
import BinaryStringInput from '../BinaryStringInput';
import { BinaryString, ValidatedInputValue } from '../../utils/types';
import passThroughChannel from '../../logic/channel';
import repeatDecode from '../../logic/decoding/repeatDecoding';
import repeatEncode from '../../logic/encoding/repeatEncoding';
import { useGetParameterInput } from '../../state/ParameterInputContext';

interface Props {
  m: ValidatedInputValue<BinaryString>;
}

const BaseTabPanel: React.FC<Props> = ({ m }) => {
  const { pe } = useGetParameterInput();
  const [initialY, setInitialY] = useState<BinaryString>([]);
  const [y, setY] = useState<ValidatedInputValue<BinaryString>>({
    status: 'pending',
    input: '',
  });

  const c = useMemo<BinaryString>(
    () => (m.status === 'success' ? repeatEncode(m.validValue, 3) : []),
    [m],
  );

  useEffect(() => {
    if (pe.status !== 'success') return;

    const newY = passThroughChannel(c, pe.validValue);
    setY({
      status: 'success',
      input: binaryStringToString(newY),
      validValue: newY,
    });
    setInitialY(newY);
  }, [c, pe]);

  const isYChanged = useMemo(
    () =>
      y.status === 'success' &&
      binaryStringToString(initialY) !== binaryStringToString(y.validValue),
    [y, initialY],
  );

  const mPrime = useMemo<ValidatedInputValue<BinaryString>>(() => {
    if (y.status !== 'success')
      return {
        status: 'pending',
        input: '',
      };
    try {
      const decodedValue = repeatDecode(y.validValue, 3);
      return {
        status: 'success',
        input: binaryStringToString(decodedValue),
        validValue: decodedValue,
      };
    } catch (err) {
      if (err instanceof Error)
        return {
          status: 'fail',
          input: '',
          message: err.message,
        };

      return {
        status: 'fail',
        input: '',
        message: 'Ran into a problem while decoding',
      };
    }
  }, [y]);

  return (
    <>
      <InputGroup>
        <InputLeftAddon>c</InputLeftAddon>
        <Input
          isReadOnly
          value={binaryStringToString(c)}
          isDisabled={m.status !== 'success'}
        />
      </InputGroup>
      <BinaryStringInput
        value={y}
        onChange={newValue => setY(newValue)}
        title="y"
        inputProps={{
          isDisabled: m.status !== 'success',
        }}
        inputRightElementContent={
          isYChanged ? (
            <Tooltip label="You have made changes to this value. Reset to initial value?">
              <Button
                h="75%"
                size="sm"
                onClick={() =>
                  setY({
                    status: 'success',
                    validValue: initialY,
                    input: binaryStringToString(initialY),
                  })
                }
              >
                Reset
              </Button>
            </Tooltip>
          ) : undefined
        }
      />
      <FormControl isInvalid={mPrime.status === 'fail'}>
        <InputGroup>
          <InputLeftAddon>m′</InputLeftAddon>
          <Input
            isReadOnly
            isDisabled={m.status !== 'success' || y.status !== 'success'}
            value={mPrime.input}
          />
        </InputGroup>
        {mPrime.status === 'fail' && (
          <FormErrorMessage>{mPrime.message}</FormErrorMessage>
        )}
      </FormControl>
    </>
  );
};

export default BaseTabPanel;
