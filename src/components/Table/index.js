import React from 'react';
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
  return (
    <TableContainer height={heightCustom}>
      <Table size="sm" color="white.200">
        <Thead>
          <Tr>
            <Th>Type</Th>
            <Th>Amount</Th>
            <Th>Price USD</Th>
            <Th>Rate</Th>
            <Th>Address</Th>
            <Th>DATE</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.length === 0 && (
            <Tr>
              <Td colSpan={6} textAlign="center">
                No data
              </Td>
            </Tr>
          )}
          {data.map(e => {
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
                <Td>{format(new Date(e.time), 'yyyy/MM/dd HH:mm')}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default TableWrapper;
