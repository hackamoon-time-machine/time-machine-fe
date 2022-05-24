import React from 'react';

import { Box, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { Search2Icon } from '@chakra-ui/icons';

const SearchBox = () => {
  return (
    <Box px={6}>
      <InputGroup
        w="400px"
        borderRadius="19px"
        bg="dark.500"
        borderColor="dark.500"
      >
        <InputLeftElement pointerEvents="none">
          <Search2Icon color="#fff" />
        </InputLeftElement>

        <Input
          type="text"
          borderRadius="19px"
          color="#fff"
          placeholder="Search by token"
        />
      </InputGroup>
    </Box>
  );
};
export default SearchBox;
