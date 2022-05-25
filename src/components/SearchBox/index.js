import React, { useCallback, useContext, useState } from 'react';

import { Box, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { Search2Icon } from '@chakra-ui/icons';
import { TradesContext } from 'contexts/Trades';

const SearchBox = () => {
  const { setToken } = useContext(TradesContext);

  const [textSearch, setTextSearch] = useState('');

  const handleKeyPress = useCallback(
    event => {
      if (event.keyCode === 13 || event.charCode === 13) {
        setToken(textSearch);
      }
    },
    [setToken, textSearch]
  );

  return (
    <Box px={6}>
      <InputGroup
        w="400px"
        borderRadius="19px"
        bg="dark.500"
        borderColor="dark.500"
      >
        <InputRightElement
          cursor="pointer"
          onClick={() => setToken(textSearch)}
        >
          <Search2Icon color="#fff" />
        </InputRightElement>

        <Input
          type="text"
          borderRadius="19px"
          color="#fff"
          placeholder="Search by token"
          value={textSearch}
          onKeyPress={handleKeyPress}
          onChange={e => setTextSearch(e.target.value)}
        />
      </InputGroup>
    </Box>
  );
};
export default SearchBox;
