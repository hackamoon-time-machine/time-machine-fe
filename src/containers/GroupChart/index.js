import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import PieChart from 'containers/PieChart';
import BarGroupChart from 'containers/BarChart';
import { Box, Heading, Select, HStack } from '@chakra-ui/react';
import { OPTION_AMOUNT, OPTION_TIME } from 'constants/global';
import axios from 'axios';
import { TradesContext } from 'contexts/Trades';
import useGetMaxBlock from 'hooks/useGetMaxBlock';

const GroupChart = () => {
  const { token } = useContext(TradesContext);
  const { lastBlock } = useGetMaxBlock();

  const query = useMemo(
    () => ({
      query: {
        bool: {
          filter: [
            {
              term: {
                'BuyAddress.keyword': token,
              },
            },
            {
              range: {
                BlockNumber: {
                  gte: lastBlock - 20 * 60,
                },
              },
            },
          ],
        },
      },
      size: 0,
      track_total_hits: true,
      aggs: {
        top_buyers: {
          terms: {
            field: 'CallerAddress.keyword',
          },
        },
      },
    }),
    [token, lastBlock]
  );

  const handleGetDataSell = useCallback(() => {
    axios
      .post(
        'https://time-machine.es.asia-southeast1.gcp.elastic-cloud.com:9243/swaps_new/_search',
        { ...query },
        {
          auth: {
            username: 'elastic',
            password: 'nQV5AQb4xLKgkQk09WpVk3VX',
          },
        }
      )
      .then(res => console.log('data chart', res.data))
      .catch(err => console.log('error in chart: ', err));
  }, [query]);

  useEffect(() => {
    handleGetDataSell();
  }, [handleGetDataSell]);

  return (
    <Box>
      <Heading as="h4" mb={4} color="#fff">
        Chart
      </Heading>
      <HStack spacing={4} color="#fff" mb={4}>
        <Select
          placeholder="Select amount"
          borderRadius="12px"
          borderColor="#2F414F"
        >
          {OPTION_AMOUNT.map(option => {
            return (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            );
          })}
        </Select>
        <Select
          placeholder="Select time"
          borderRadius="12px"
          borderColor="#2F414F"
        >
          {OPTION_TIME.map(option => {
            return (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            );
          })}
        </Select>
      </HStack>

      <PieChart />
      <BarGroupChart />
    </Box>
  );
};

export default GroupChart;
