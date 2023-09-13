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
  mPrime: ValidatedInputValue<BinaryString>;
  setMPrime: React.Dispatch<
    React.SetStateAction<ValidatedInputValue<BinaryString>>
  >;
  displayM?: boolean;
}

const BaseTabPanel: React.FC<Props> = ({
  m,
  mPrime,
  setMPrime,
  displayM = true,
}) => {
  const { pe, n } = useGetParameterInput();
  const [initialY, setInitialY] = useState<BinaryString>([]);
  const [y, setY] = useState<ValidatedInputValue<BinaryString>>({
    status: 'pending',
    input: '',
  });

  const c = useMemo<BinaryString>(
    () =>
      m.status === 'success' && n.status === 'success'
        ? repeatEncode(m.validValue, n.validValue)
        : [],
    [m, n],
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

  useEffect(() => {
    if (y.status !== 'success' || n.status !== 'success') {
      setMPrime({
        status: 'pending',
        input: '',
      });
      return;
    }

    try {
      const decodedValue = repeatDecode(y.validValue, n.validValue);
      setMPrime({
        status: 'success',
        input: binaryStringToString(decodedValue),
        validValue: decodedValue,
      });
    } catch (err) {
      if (err instanceof Error) {
        setMPrime({
          status: 'fail',
          input: '',
          message: err.message,
        });
        return;
      }

      setMPrime({
        status: 'fail',
        input: '',
        message: 'Ran into a problem while decoding',
      });
    }
  }, [y, n, setMPrime]);

  return (
    <>
      {displayM && (
        <InputGroup>
          <InputLeftAddon>m</InputLeftAddon>
          <Input
            isReadOnly
            value={m.input}
            isDisabled={m.status !== 'success'}
          />
        </InputGroup>
      )}
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
