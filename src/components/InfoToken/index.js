import React from 'react';

import { Box, Flex, HStack, Text } from '@chakra-ui/react';

const InfoToken = () => {
  const info = {
    symbol: 'OXFE',
    name: 'Atoine',
    address: '0xfe56d5892BDffC7BF58f2E84BE1b2C32D21C308b',
  };
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
            <Text color="white.200" w="100px">
              Symbol:
            </Text>
            <Text noOfLines={1} title={info.symbol} color="dark.100">
              {info.symbol}
            </Text>
          </Flex>
        </Box>
        <Box w="25%" {...styleInfo}>
          <Flex>
            <Text color="white.200" w="100px">
              Name:
            </Text>
            <Text noOfLines={1} title={info.name} color="dark.100">
              {info.name}
            </Text>
          </Flex>
        </Box>
        <Box w="50%" {...styleInfo}>
          <Flex>
            <Text color="white.200" w="100px">
              Address:
            </Text>
            <Text noOfLines={1} title={info.address} color="dark.100">
              {info.address}
            </Text>
          </Flex>
        </Box>
      </HStack>
    </Box>
  );
};

export default InfoToken;
