import React, { useContext } from 'react';

import { Box, Flex, HStack, Text } from '@chakra-ui/react';
import { TradesContext } from 'contexts/Trades';

const InfoToken = () => {
  const { infoToken } = useContext(TradesContext);

  const styleInfo = {
    borderColor: 'darkblue.500',
    bg: 'dark.500',
    borderRadius: '16px',
    px: 4,
    py: 2,
    fontSize: '14px',
  };

  return (
    <Box>
      <HStack spacing={4}>
        <Box w="25%" {...styleInfo}>
          <Flex>
            <Text color="white.200" mr="3">
              Symbol:
            </Text>
            <Text noOfLines={1} title={infoToken.symbol} color="dark.100">
              {infoToken.symbol}
            </Text>
          </Flex>
        </Box>
        <Box w="25%" {...styleInfo}>
          <Flex>
            <Text color="white.200" mr="3">
              Name:
            </Text>
            <Text noOfLines={1} title={infoToken.name} color="dark.100">
              {infoToken.name}
            </Text>
          </Flex>
        </Box>
        <Box w="50%" {...styleInfo}>
          <Flex>
            <Text color="white.200" mr="3">
              Address:
            </Text>
            <Text noOfLines={1} title={infoToken.address} color="dark.100">
              {infoToken.address}
            </Text>
          </Flex>
        </Box>
      </HStack>
    </Box>
  );
};

export default InfoToken;
