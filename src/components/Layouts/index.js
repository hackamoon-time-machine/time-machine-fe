import React from 'react';
import { Box, Stack, VStack } from '@chakra-ui/react';
import SearchBox from 'components/SearchBox';
import InfoToken from 'components/InfoToken';
import Trades from 'containers/Trades';
import GroupChart from 'containers/GroupChart';
import useWrapperRef from 'hooks/useWrapperRef';
import useGetMaxBlock from 'hooks/useGetMaxBlock';

const Layouts = () => {
  const { height, wrapperRef } = useWrapperRef(300);
  const { lastBlock } = useGetMaxBlock();
  return (
    <Box p={4} bg="#20252C" ref={wrapperRef}>
      <VStack spacing={6} align="stretch">
        <SearchBox />
        <Box>
          <Stack direction={{ base: 'column', md: 'row' }} spacing={8} px={6}>
            <Box w={{ base: '60%' }}>
              <VStack spacing={4} align="stretch">
                <InfoToken />
                <Trades heightCustom={height} lastBlock={lastBlock} />
              </VStack>
            </Box>
            <Box w={{ base: '40%' }} p={5} borderRadius="12px" bg="dark.400">
              <GroupChart />
            </Box>
          </Stack>
        </Box>
      </VStack>
    </Box>
  );
};

export default Layouts;
