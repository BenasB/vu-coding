import {
  FormControl,
  Input,
  InputGroup,
  InputLeftAddon,
  VStack,
} from '@chakra-ui/react';
import React, { useMemo, useState } from 'react';
import BaseTabPanel from './BaseTabPanel';
import { textToBinaryString } from '../../utils/type-utils';

const RawTabPanel: React.FC = () => {
  const [m, setM] = useState<string>('');
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setM(e.target.value);
  };

  const binaryM = useMemo(() => textToBinaryString(m), [m]);

  return (
    <VStack spacing={4}>
      <FormControl>
        <InputGroup>
          <InputLeftAddon>m</InputLeftAddon>
          <Input value={m} onChange={handleOnChange} />
        </InputGroup>
      </FormControl>
      <BaseTabPanel
        m={{
          status: 'success',
          input: m,
          validValue: binaryM,
        }}
      />
    </VStack>
  );
};

export default RawTabPanel;
