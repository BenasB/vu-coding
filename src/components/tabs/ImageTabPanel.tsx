import {
  FormControl,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  VStack,
} from '@chakra-ui/react';
import React, { useEffect, useMemo, useState } from 'react';
import BaseTabPanel from './BaseTabPanel';
import { ValidatedInputValue, BinaryString } from '../../utils/types';
import { readFileAsArrayBuffer } from '../../utils/file-utils';
import {
  arrayBufferToBinaryString,
  binaryStringToArrayBuffer,
} from '../../utils/type-utils';
import { ImgComparisonSlider } from '@img-comparison-slider/react';
import { decode as bmpDecode } from 'bmp-js';

const ImageTabPanel: React.FC = () => {
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
        const binaryString = arrayBufferToBinaryString(bmpData, 8);
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

  const [mPrime, setMPrime] = useState<ValidatedInputValue<BinaryString>>({
    status: 'pending',
    input: '',
  });

  const afterImage = useMemo<ValidatedInputValue<string>>(() => {
    if (mPrime.status !== 'success' || beforeImage === undefined)
      return {
        status: 'pending',
        input: '',
      };
    try {
      const base64Buffer = Buffer.concat([
        beforeImage.header,
        Buffer.from(binaryStringToArrayBuffer(mPrime.validValue, 8)),
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
      <BaseTabPanel m={m} mPrime={mPrime} setMPrime={setMPrime} />
      {beforeImage && afterImage.status === 'success' && (
        <ImgComparisonSlider>
          <Image
            slot="first"
            src={`data:image/*;base64,${Buffer.concat([
              beforeImage.header,
              beforeImage.data,
            ]).toString('base64')}`}
            width={'100%'}
          />
          <Image
            slot="second"
            src={`data:image/*;base64,${afterImage.validValue}`}
            width={'100%'}
          />
        </ImgComparisonSlider>
      )}
    </VStack>
  );
};

export default ImageTabPanel;
