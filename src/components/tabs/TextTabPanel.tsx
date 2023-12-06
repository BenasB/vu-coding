import {
  Alert,
  AlertIcon,
  FormControl,
  FormErrorMessage,
  InputGroup,
  InputLeftAddon,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import React, { useMemo, useState } from 'react';
import {
  binaryStringToText,
  createBinaryString,
  textToBinaryString,
} from '../../utils/type-utils';
import { BinaryString, ValidatedInputValue } from '../../utils/types';
import passThroughChannel from '../../logic/channel';
import { useGetParameterInput } from '../../state/ParameterInputContext';
import { reedMullerEncode } from '../../logic/encoding/rmEncoding';
import { reedMullerDecode } from '../../logic/decoding/rmDecoding';

const RawTabPanel: React.FC = () => {
  const { pe, n, generationMatrix, controlMatrices } = useGetParameterInput();

  const [textInput, setTextInput] = useState<string>('');
  const handleOnTextInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setTextInput(e.target.value);
  };

  const v = useMemo<ValidatedInputValue<BinaryString>>(() => {
    try {
      const binaryString = textToBinaryString(textInput);
      return {
        status: 'success',
        input: binaryString,
        validValue: binaryString,
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
        message: 'Ran into a problem while converting input text to binary',
      };
    }
  }, [textInput]);

  const padding = useMemo<number | undefined>(
    () =>
      v.status === 'success' && n.status === 'success'
        ? (n.validValue + 1 - (v.validValue.length % (n.validValue + 1))) %
          (n.validValue + 1)
        : undefined,
    [v, n],
  );

  const c = useMemo<ValidatedInputValue<BinaryString>>(() => {
    if (
      v.status !== 'success' ||
      n.status !== 'success' ||
      generationMatrix === undefined ||
      padding === undefined
    )
      return { status: 'pending', input: '' };

    try {
      const encodedValue = reedMullerEncode(
        createBinaryString(
          v.validValue.padEnd(v.validValue.length + padding, '0'),
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
  }, [v, n, generationMatrix, padding]);

  const y = useMemo<ValidatedInputValue<BinaryString>>(() => {
    if (pe.status !== 'success' || c.status !== 'success') {
      return {
        status: 'pending',
        input: '',
      };
    }

    const newY = passThroughChannel(c.validValue, pe.validValue);
    return {
      status: 'success',
      input: newY,
      validValue: newY,
    };
  }, [pe, c]);

  const vPrime = useMemo<ValidatedInputValue<BinaryString>>(() => {
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

  const outputText = useMemo<ValidatedInputValue<string>>(() => {
    if (vPrime.status !== 'success' || padding === undefined)
      return {
        status: 'pending',
        input: '',
      };
    try {
      const text = binaryStringToText(
        createBinaryString(
          vPrime.validValue.substring(0, vPrime.validValue.length - padding),
        ),
      );
      return {
        status: 'success',
        input: text,
        validValue: text,
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
        message: 'Ran into a problem while converting m prime to text',
      };
    }
  }, [vPrime, padding]);

  const uncodedOutputText = useMemo<ValidatedInputValue<string>>(() => {
    if (pe.status !== 'success' || v.status !== 'success') {
      return {
        status: 'pending',
        input: '',
      };
    }

    const vPrimeUncoded = passThroughChannel(v.validValue, pe.validValue);

    try {
      const text = binaryStringToText(vPrimeUncoded);
      return {
        status: 'success',
        input: text,
        validValue: text,
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
        message: 'Ran into a problem while converting m prime to text',
      };
    }
  }, [pe, v]);

  return (
    <VStack spacing={4}>
      <FormControl>
        <InputGroup alignItems={'stretch'}>
          <InputLeftAddon height={'auto'}>Input</InputLeftAddon>
          <Textarea value={textInput} onChange={handleOnTextInputChange} />
        </InputGroup>
      </FormControl>
      {v.status === 'fail' && (
        <Alert status="error">
          <AlertIcon />
          {v.message}
        </Alert>
      )}
      {c.status === 'fail' && (
        <Alert status="error">
          <AlertIcon />
          {c.message}
        </Alert>
      )}
      {y.status === 'fail' && (
        <Alert status="error">
          <AlertIcon />
          {y.message}
        </Alert>
      )}
      {vPrime.status === 'fail' && (
        <Alert status="error">
          <AlertIcon />
          {vPrime.message}
        </Alert>
      )}
      <FormControl isInvalid={uncodedOutputText.status === 'fail'}>
        <InputGroup alignItems={'stretch'}>
          <InputLeftAddon height={'auto'}>
            Output
            <br />
            (uncoded)
          </InputLeftAddon>
          <Textarea value={uncodedOutputText.input} isReadOnly />
        </InputGroup>
        {uncodedOutputText.status === 'fail' && (
          <FormErrorMessage>{uncodedOutputText.message}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl isInvalid={outputText.status === 'fail'}>
        <InputGroup alignItems={'stretch'}>
          <InputLeftAddon height={'auto'}>Output</InputLeftAddon>
          <Textarea value={outputText.input} isReadOnly />
        </InputGroup>
        {outputText.status === 'fail' && (
          <FormErrorMessage>{outputText.message}</FormErrorMessage>
        )}
      </FormControl>
    </VStack>
  );
};

export default RawTabPanel;
