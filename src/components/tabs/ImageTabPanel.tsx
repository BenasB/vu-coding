import {
  FormControl,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  VStack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import BaseTabPanel from './BaseTabPanel';
import { ValidatedInputValue, BinaryString } from '../../utils/types';
import { readFileAsArrayBuffer } from '../../utils/file-utils';
import { arrayBufferToBinaryString } from '../../utils/type-utils';
import { ImgComparisonSlider } from '@img-comparison-slider/react';

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

  const [beforeImage, setBeforeImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    const startImageLoad = async () => {
      if (imageInput === undefined) return;
      setBeforeImage(undefined);
      setM({
        status: 'pending',
        input: '',
      });
      const arrayBuffer = await readFileAsArrayBuffer(imageInput);
      setBeforeImage(Buffer.from(arrayBuffer).toString('base64'));
      if (!ignore) {
        const binaryString = arrayBufferToBinaryString(arrayBuffer, 8);
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
        <ImgComparisonSlider>
          <img
            slot="first"
            src="https://img-comparison-slider.sneas.io/demo/images/before.webp"
          />
          <Image
            slot="second"
            src={`data:image/*;base64,${beforeImage}`}
            width={'100%'}
          />
        </ImgComparisonSlider>
      )}
      <BaseTabPanel m={m} mPrime={mPrime} setMPrime={setMPrime} />
    </VStack>
  );
};

export default ImageTabPanel;
