import { VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import BinaryStringInput from '../BinaryStringInput';
import { ValidatedInputValue, BinaryString } from '../../utils/types';
import BaseTabPanel from './BaseTabPanel';

const RawTabPanel: React.FC = () => {
  const [m, setM] = useState<ValidatedInputValue<BinaryString>>({
    status: 'pending',
    input: '',
  });

  const [mPrime, setMPrime] = useState<ValidatedInputValue<BinaryString>>({
    status: 'pending',
    input: '',
  });

  return (
    <VStack spacing={4}>
      <BinaryStringInput
        value={m}
        onChange={newValue => setM(newValue)}
        title="m"
      />
      <BaseTabPanel
        m={m}
        mPrime={mPrime}
        setMPrime={setMPrime}
        displayM={false}
      />
    </VStack>
  );
};

export default RawTabPanel;
