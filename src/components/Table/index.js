import React, { useMemo } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { BUY } from 'constants/swap';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { ellipsis } from 'utils';
import { Link } from '@chakra-ui/react';

const TableWrapper = ({ data, heightCustom }) => {
  const sliceData = useMemo(() => {
    return data.slice(0, 20) || [];
  }, [data]);

  return (
    <TableContainer height={heightCustom}>
      <Table
        size="sm"
        color="white.200"
        variant="unstyled"
        w="100%"
        style={{ tableLayout: 'fixed', display: 'block' }}
      >
        <Thead>
          <Tr color="dark.200">
            <Th w="10%">Type</Th>
            <Th w="20%">Amount</Th>
            <Th w="20%">Price USD</Th>
            <Th w="15%">Rate</Th>
            <Th w="15%">Address</Th>
            <Th w="20%">Date</Th>
          </Tr>
        </Thead>
        <Tbody>
          {sliceData.length === 0 && (
            <Tr>
              <Td colSpan={6} textAlign="center" h="200px">
                No data
              </Td>
            </Tr>
          )}
          {sliceData.map(e => {
            return (
              <Tr
                key={e.uniqKey}
                color={e.type === BUY ? 'primary.100' : 'secondary.100'}
                borderColor="darkblue.400"
              >
                <Td>{e.type}</Td>
                <Td>{e.amount.toFixed(4)}</Td>
                <Td>${e.value.toFixed(4)}</Td>
                <Td>${e.rate.toFixed(4)}</Td>
                <Td color="#fff">
                  <Link
                    href={`https://bscscan.com/address/${e.caller}`}
                    isExternal
                  >
                    {ellipsis(e.caller)} <ExternalLinkIcon mx="2px" />
                  </Link>
                </Td>
                <Td>{format(new Date(e.time), 'yyyy/MM/dd HH:mm:ss')}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default TableWrapper;
