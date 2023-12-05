import {
  FormControl,
  FormErrorMessage,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  VStack,
} from '@chakra-ui/react';
import React, { useEffect, useMemo, useState } from 'react';
import { ValidatedInputValue, BinaryString } from '../../utils/types';
import { readFileAsArrayBuffer } from '../../utils/file-utils';
import {
  arrayBufferToBinaryString,
  binaryStringToArrayBuffer,
} from '../../utils/type-utils';
import { ImgComparisonSlider } from '@img-comparison-slider/react';
import { decode as bmpDecode } from 'bmp-js';
import passThroughChannel from '../../logic/channel';
import repeatDecode from '../../logic/decoding/repeatDecoding';
import repeatEncode from '../../logic/encoding/repeatEncoding';
import { useGetParameterInput } from '../../state/ParameterInputContext';

const BYTE_SIZE = 8;

const ImageTabPanel: React.FC = () => {
  const { pe, n } = useGetParameterInput();

  const [imageInput, setImageInput] = useState<File | undefined>(undefined);
  const handleOnImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);
    setImageInput(file ?? undefined);
  };

  const [m, setM] = useState<ValidatedInputValue<BinaryString>>({
    status: 'pending',
    input: '',
  });

  const [beforeImage, setBeforeImage] = useState<
    { data: Buffer; header: Buffer } | undefined
  >(undefined);

  useEffect(() => {
    const startImageLoad = async () => {
      if (imageInput === undefined) return;
      setBeforeImage(undefined);
      setM({
        status: 'pending',
        input: '',
      });
      const arrayBuffer = await readFileAsArrayBuffer(imageInput);
      if (!ignore) {
        const fullBuffer = Buffer.from(arrayBuffer);
        const bmpFile = bmpDecode(fullBuffer);
        const bmpHeader = fullBuffer.subarray(0, bmpFile.offset);
        const bmpData = fullBuffer.subarray(bmpFile.offset);
        setBeforeImage({
          header: bmpHeader,
          data: bmpData,
        });
        const binaryString = arrayBufferToBinaryString(bmpData, BYTE_SIZE);
        setM({
          status: 'success',
          input: binaryString,
          validValue: binaryString,
        });
      }
    };

    let ignore = false;
    startImageLoad().catch(err => console.log('Error in image load', err));
    return () => {
      ignore = true;
    };
  }, [imageInput]);

  const c = useMemo<ValidatedInputValue<BinaryString>>(() => {
    if (m.status !== 'success' || n.status !== 'success')
      return { status: 'pending', input: '' };

    const encodedValue = repeatEncode(m.validValue, n.validValue);

    return {
      status: 'success',
      input: encodedValue,
      validValue: encodedValue,
    };
  }, [m, n]);

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

  const mPrime = useMemo<ValidatedInputValue<BinaryString>>(() => {
    if (y.status !== 'success' || n.status !== 'success') {
      return {
        status: 'pending',
        input: '',
      };
    }

    try {
      const decodedValue = repeatDecode(y.validValue, n.validValue);
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
  }, [y, n]);

  const afterImage = useMemo<ValidatedInputValue<string>>(() => {
    if (mPrime.status !== 'success' || beforeImage === undefined)
      return {
        status: 'pending',
        input: '',
      };
    try {
      const base64Buffer = Buffer.concat([
        beforeImage.header,
        Buffer.from(binaryStringToArrayBuffer(mPrime.validValue, BYTE_SIZE)),
      ]).toString('base64');
      return {
        status: 'success',
        input: base64Buffer,
        validValue: base64Buffer,
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
        message: 'Ran into a problem while converting m prime to image',
      };
    }
  }, [mPrime, beforeImage]);

  const uncodedAfterImage = useMemo<ValidatedInputValue<string>>(() => {
    if (
      pe.status !== 'success' ||
      m.status !== 'success' ||
      beforeImage === undefined
    ) {
      return {
        status: 'pending',
        input: '',
      };
    }

    const mPrimeUncoded = passThroughChannel(m.validValue, pe.validValue);

    try {
      const base64Buffer = Buffer.concat([
        beforeImage.header,
        Buffer.from(binaryStringToArrayBuffer(mPrimeUncoded, BYTE_SIZE)),
      ]).toString('base64');
      return {
        status: 'success',
        input: base64Buffer,
        validValue: base64Buffer,
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
  }, [pe, m, beforeImage]);

  return (
    <VStack spacing={4}>
      <FormControl>
        <InputGroup>
          <InputLeftAddon>Input</InputLeftAddon>
          <Input
            type="file"
            accept="image/*"
            onChange={handleOnImageInputChange}
            sx={{
              '::file-selector-button': {
                display: 'none',
              },
            }}
            lineHeight={'35px'}
          />
        </InputGroup>
      </FormControl>
      {beforeImage && (
        <FormControl isInvalid={uncodedAfterImage.status === 'fail'}>
          <InputGroup alignItems={'stretch'}>
            <InputLeftAddon height={'auto'}>Output (uncoded)</InputLeftAddon>
            <ImgComparisonSlider>
              <Image
                slot="first"
                src={`data:image/*;base64,${Buffer.concat([
                  beforeImage.header,
                  beforeImage.data,
                ]).toString('base64')}`}
                width={'100%'}
              />
              {uncodedAfterImage.status === 'success' && (
                <Image
                  slot="second"
                  src={`data:image/*;base64,${uncodedAfterImage.validValue}`}
                  width={'100%'}
                />
              )}
            </ImgComparisonSlider>
          </InputGroup>
          {uncodedAfterImage.status === 'fail' && (
            <FormErrorMessage>{uncodedAfterImage.message}</FormErrorMessage>
          )}
        </FormControl>
      )}
      {beforeImage && (
        <FormControl isInvalid={afterImage.status === 'fail'}>
          <InputGroup alignItems={'stretch'}>
            <InputLeftAddon height={'auto'}>Output</InputLeftAddon>
            <ImgComparisonSlider>
              <Image
                slot="first"
                src={`data:image/*;base64,${Buffer.concat([
                  beforeImage.header,
                  beforeImage.data,
                ]).toString('base64')}`}
                width={'100%'}
              />
              {afterImage.status === 'success' && (
                <Image
                  slot="second"
                  src={`data:image/*;base64,${afterImage.validValue}`}
                  width={'100%'}
                />
              )}
            </ImgComparisonSlider>
          </InputGroup>
          {afterImage.status === 'fail' && (
            <FormErrorMessage>{afterImage.message}</FormErrorMessage>
          )}
        </FormControl>
      )}
    </VStack>
  );
};

export default ImageTabPanel;
