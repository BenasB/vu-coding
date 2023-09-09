import {
  Center,
  Container,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ValidatedInputValue } from './utils/types';
import ParameterInputGroup from './components/ParameterInputGroup';
import RawTabPanel from './components/tabs/RawTabPanel';
import ParameterInputContext, {
  parameterInputContextPropsInitial,
} from './state/ParameterInputContext';

const App = () => {
  const [pe, setPe] = useState<ValidatedInputValue<number>>(
    parameterInputContextPropsInitial.pe,
  );

  return (
    <Container maxW="container.md">
      <Heading py={50}>
        <Center>Encoding</Center>
      </Heading>
      <VStack align={'stretch'} spacing={4}>
        <ParameterInputGroup pe={pe} setPe={setPe} />

        <Tabs>
          <TabList>
            <Tab>Raw</Tab>
            <Tab isDisabled>Text</Tab>
            <Tab isDisabled>Image</Tab>
          </TabList>

          <ParameterInputContext.Provider value={{ pe }}>
            <TabPanels>
              <TabPanel px={0}>
                <RawTabPanel />
              </TabPanel>
            </TabPanels>
          </ParameterInputContext.Provider>
        </Tabs>
      </VStack>
    </Container>
  );
};

export default App;
