import { useEffect, useMemo, useState } from 'react';
import { reedMullerEncode } from '../logic/encoding/rmEncoding';
import { createBinaryString } from '../utils/type-utils';
import { ValidatedInputValue, BinaryString } from '../utils/types';
import { useGetParameterInput } from './ParameterInputContext';
import passThroughChannel from '../logic/channel';
import { reedMullerDecode } from '../logic/decoding/rmDecoding';
import { UseToastOptions, useToast } from '@chakra-ui/react';

export const useBinaryPaddingCount: (
  v: ValidatedInputValue<BinaryString>,
) => number | undefined = v => {
  const { m } = useGetParameterInput();

  return useMemo<number | undefined>(
    () =>
      v.status === 'success' && m.status === 'success'
        ? (m.validValue + 1 - (v.validValue.length % (m.validValue + 1))) %
          (m.validValue + 1)
        : undefined,
    [v, m],
  );
};

export const useC: (
  v: ValidatedInputValue<BinaryString>,
  padding: number | undefined,
  showToast?: boolean,
) => ValidatedInputValue<BinaryString> = (v, padding, showToast = false) => {
  const { m, generationMatrix } = useGetParameterInput();
  const [toastMessage, setToastMessage] = useState<UseToastOptions | undefined>(
    undefined,
  );
  const toast = useToast();

  useEffect(() => {
    if (toastMessage) {
      toast(toastMessage);
    }
  }, [toastMessage, toast]);

  return useMemo<ValidatedInputValue<BinaryString>>(() => {
    if (
      v.status !== 'success' ||
      m.status !== 'success' ||
      generationMatrix === undefined ||
      padding === undefined
    )
      return { status: 'pending', input: '' };

    try {
      const timeBefore = new Date();
      const encodedValue = reedMullerEncode(
        createBinaryString(
          v.validValue.padEnd(v.validValue.length + padding, '0'),
        ),
        m.validValue,
        generationMatrix,
      );
      const elapsedTime = new Date().getTime() - timeBefore.getTime();
      console.log(`Encoding took: ${elapsedTime} ms`);
      if (showToast) {
        setToastMessage({
          description: `Encoding took: ${elapsedTime} ms`,
          status: 'success',
          duration: 5000,
          position: 'bottom-right',
        });
      }

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
  }, [v, m, generationMatrix, padding, setToastMessage, showToast]);
};

export const useY: (
  c: ValidatedInputValue<BinaryString>,
) => ValidatedInputValue<BinaryString> = c => {
  const { pe } = useGetParameterInput();

  return useMemo<ValidatedInputValue<BinaryString>>(() => {
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
};

export const useVPrime: (
  y: ValidatedInputValue<BinaryString>,
  showToast?: boolean,
) => ValidatedInputValue<BinaryString> = (y, showToast = false) => {
  const { controlMatrices, m } = useGetParameterInput();
  const [toastMessage, setToastMessage] = useState<UseToastOptions | undefined>(
    undefined,
  );
  const toast = useToast();

  useEffect(() => {
    if (toastMessage) {
      toast(toastMessage);
    }
  }, [toastMessage, toast]);

  return useMemo<ValidatedInputValue<BinaryString>>(() => {
    if (
      y.status !== 'success' ||
      m.status !== 'success' ||
      controlMatrices === undefined
    ) {
      return {
        status: 'pending',
        input: '',
      };
    }

    try {
      const timeBefore = new Date();
      const decodedValue = reedMullerDecode(
        y.validValue,
        controlMatrices,
        m.validValue,
      );
      const elapsedTime = new Date().getTime() - timeBefore.getTime();
      console.log(`Decoding took: ${elapsedTime} ms`);
      if (showToast) {
        setToastMessage({
          description: `Decoding took: ${elapsedTime} ms`,
          status: 'success',
          duration: 5000,
          position: 'bottom-right',
        });
      }

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
  }, [y, m, controlMatrices, setToastMessage, showToast]);
};

export const useVPrimeUncoded: <T extends { toString: () => string }>(
  v: ValidatedInputValue<BinaryString>,
  transform: (channelOutput: BinaryString) => T,
) => ValidatedInputValue<T> = <T extends { toString: () => string }>(
  v: ValidatedInputValue<BinaryString>,
  transform: (channelOutput: BinaryString) => T,
) => {
  const { pe } = useGetParameterInput();

  return useMemo<ValidatedInputValue<T>>(() => {
    if (pe.status !== 'success' || v.status !== 'success') {
      return {
        status: 'pending',
        input: '',
      };
    }

    const vPrimeUncoded = passThroughChannel(v.validValue, pe.validValue);

    try {
      const result = transform(vPrimeUncoded);
      return {
        status: 'success',
        input: result.toString(),
        validValue: result,
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
        message: 'Ran into a problem while converting m prime',
      };
    }
  }, [pe, v, transform]);
};
