import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputLeftAddon,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import React, { useEffect, useMemo, useState } from 'react';
import BinaryStringInput from '../BinaryStringInput';
import { ValidatedInputValue, BinaryString } from '../../utils/types';
import { useGetParameterInput } from '../../state/ParameterInputContext';
import passThroughChannel from '../../logic/channel';
import { reedMullerEncode } from '../../logic/encoding/rmEncoding';
import { createBinaryString } from '../../utils/type-utils';
import { reedMullerDecode } from '../../logic/decoding/rmDecoding';

const RawTabPanel: React.FC = () => {
  const { pe, n, generationMatrix, controlMatrices } = useGetParameterInput();

  const [m, setM] = useState<ValidatedInputValue<BinaryString>>({
    status: 'pending',
    input: '',
  });

  const c = useMemo<ValidatedInputValue<BinaryString>>(() => {
    if (
      m.status !== 'success' ||
      n.status !== 'success' ||
      generationMatrix === undefined
    )
      return { status: 'pending', input: '' };

    try {
      const encodedValue = reedMullerEncode(
        createBinaryString(
          //m.validValue.padEnd(m.validValue.length + padding, '0'),
          m.validValue,
        ),
        n.validValue,
        generationMatrix,
      );
      return {
        status: 'success',
        input: encodedValue,
        validValue: encodedValue,
      };
    } catch (err) {
      if (err instanceof Error) {
        return {
          status: 'fail',
          input: '',
          message: err.message,
        };
      }

      return {
        status: 'fail',
        input: '',
        message: 'Ran into a problem while decoding',
      };
    }
  }, [m, n, generationMatrix]);

  const [initialY, setInitialY] = useState<BinaryString | undefined>(undefined);

  const [y, setY] = useState<ValidatedInputValue<BinaryString>>({
    status: 'pending',
    input: '',
  });

  useEffect(() => {
    if (pe.status !== 'success' || c.status !== 'success') {
      setY({
        status: 'pending',
        input: '',
      });
      setInitialY(undefined);
      return;
    }

    const newY = passThroughChannel(c.validValue, pe.validValue);
    setY({
      status: 'success',
      input: newY,
      validValue: newY,
    });
    setInitialY(newY);
  }, [c, pe]);

  const isYChanged = useMemo(
    () =>
      (y.status != 'success' && initialY !== undefined) ||
      (y.status === 'success' && y.validValue !== initialY),
    [y, initialY],
  );

  const mPrime = useMemo<ValidatedInputValue<BinaryString>>(() => {
    if (
      y.status !== 'success' ||
      n.status !== 'success' ||
      controlMatrices === undefined
    ) {
      return {
        status: 'pending',
        input: '',
      };
    }

    try {
      const decodedValue = reedMullerDecode(
        y.validValue,
        controlMatrices,
        n.validValue,
      );
      return {
        status: 'success',
        input: decodedValue,
        validValue: decodedValue,
      };
    } catch (err) {
      if (err instanceof Error) {
        return {
          status: 'fail',
          input: '',
          message: err.message,
        };
      }

      return {
        status: 'fail',
        input: '',
        message: 'Ran into a problem while decoding',
      };
    }
  }, [y, n, controlMatrices]);

  return (
    <VStack spacing={4}>
      <BinaryStringInput
        value={m}
        onChange={newValue => setM(newValue)}
        title="m"
      />
      <FormControl isInvalid={c.status === 'fail'}>
        <InputGroup>
          <InputLeftAddon>c</InputLeftAddon>
          <Input
            isReadOnly
            value={c.input}
            isDisabled={c.status !== 'success'}
          />
        </InputGroup>
        {c.status === 'fail' && (
          <FormErrorMessage>{c.message}</FormErrorMessage>
        )}
      </FormControl>
      <BinaryStringInput
        value={y}
        onChange={newValue => setY(newValue)}
        title="y"
        inputProps={{
          isDisabled: m.status !== 'success',
        }}
        inputRightElementContent={
          isYChanged && initialY ? (
            <Tooltip label="You have made changes to this value. Reset to initial value?">
              <Button
                h="75%"
                size="sm"
                onClick={() =>
                  setY({
                    status: 'success',
                    validValue: initialY,
                    input: initialY,
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
            isDisabled={
              mPrime.status !== 'success' ||
              m.status !== 'success' ||
              y.status !== 'success'
            }
            value={mPrime.input}
          />
        </InputGroup>
        {mPrime.status === 'fail' && (
          <FormErrorMessage>{mPrime.message}</FormErrorMessage>
        )}
      </FormControl>
    </VStack>
  );
};

export default RawTabPanel;
