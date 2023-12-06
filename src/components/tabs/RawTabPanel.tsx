import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import React, { useEffect, useMemo, useState } from 'react';
import BinaryStringInput from '../BinaryStringInput';
import { ValidatedInputValue, BinaryString } from '../../utils/types';
import { useGetParameterInput } from '../../state/ParameterInputContext';
import passThroughChannel from '../../logic/channel';
import { useC, useVPrime } from '../../state/codingMemos';

const RawTabPanel: React.FC = () => {
  const { pe } = useGetParameterInput();

  const [v, setV] = useState<ValidatedInputValue<BinaryString>>({
    status: 'pending',
    input: '',
  });

  const c = useC(v, 0);

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

  const e = useMemo<string>(() => {
    if (c.status !== 'success' || y.status !== 'success') return '';

    return c.validValue
      .split('')
      .map((x, i) => (x === y.validValue[i] ? '0' : '1'))
      .join('');
  }, [c, y]);

  const eCount = useMemo<number>(
    () =>
      e?.split('').reduce<number>((sum, cur) => (sum += parseInt(cur)), 0) ?? 0,
    [e],
  );

  const vPrime = useVPrime(y);

  return (
    <VStack spacing={4}>
      <BinaryStringInput
        value={v}
        onChange={newValue => setV(newValue)}
        title={
          <Tooltip label="Input binary string">
            <InputLeftAddon>v</InputLeftAddon>
          </Tooltip>
        }
      />
      <FormControl isInvalid={c.status === 'fail'}>
        <InputGroup>
          <Tooltip label="Encoded value">
            <InputLeftAddon>c</InputLeftAddon>
          </Tooltip>
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
        title={
          <Tooltip label="Encoded value passed through the channel">
            <InputLeftAddon>y</InputLeftAddon>
          </Tooltip>
        }
        inputProps={{
          isDisabled: v.status !== 'success' || c.status !== 'success',
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
      <FormControl>
        <InputGroup>
          <Tooltip label="Error vector">
            <InputLeftAddon>e</InputLeftAddon>
          </Tooltip>
          <Input
            isReadOnly
            value={e}
            isDisabled={e === undefined || eCount === undefined}
          />
          <Tooltip label="Error count">
            <InputRightAddon>{eCount}</InputRightAddon>
          </Tooltip>
        </InputGroup>
      </FormControl>
      <FormControl isInvalid={vPrime.status === 'fail'}>
        <InputGroup>
          <Tooltip label="Decoded value from the channel">
            <InputLeftAddon>v′</InputLeftAddon>
          </Tooltip>
          <Input
            isReadOnly
            isDisabled={
              vPrime.status !== 'success' ||
              v.status !== 'success' ||
              y.status !== 'success'
            }
            value={vPrime.input}
          />
        </InputGroup>
        {vPrime.status === 'fail' && (
          <FormErrorMessage>{vPrime.message}</FormErrorMessage>
        )}
      </FormControl>
    </VStack>
  );
};

export default RawTabPanel;
