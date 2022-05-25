import React, { useCallback, useContext, useEffect, useState } from 'react';
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
  const [dataPie, setDataPie] = useState({
    totalBuy: 0,
    totalSell: 0,
  });

  const getQueryByType = useCallback(
    type => ({
      query: {
        bool: {
          filter: [
            {
              term: {
                [type]: token,
              },
            },
            {
              range: {
                BlockNumber: {
                  gte: lastBlock - 100000,
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

  const handleGetData = useCallback(async () => {
    if (!lastBlock) {
      return;
    }
    const sellQuery = getQueryByType('SellAddress.keyword');
    const buyQuery = getQueryByType('BuyAddress.keyword');
    const [res1, res2] = await Promise.all([
      axios.post(
        'https://time-machine.es.asia-southeast1.gcp.elastic-cloud.com:9243/swaps_new/_search',
        { ...sellQuery },
        {
          auth: {
            username: 'elastic',
            password: 'nQV5AQb4xLKgkQk09WpVk3VX',
          },
        }
      ),
      axios.post(
        // 'https://time-machine.es.asia-southeast1.gcp.elastic-cloud.com:9243/swaps_new/_search',
        'https://neproxy-dev.krystal.team/temp-es/swaps_new/_search',
        { ...buyQuery },
        {
          auth: {
            username: 'elastic',
            password: 'nQV5AQb4xLKgkQk09WpVk3VX',
          },
        }
      ),
    ]);

    setDataPie({
      totalBuy: res2.data.hits.total.value,
      totalSell: res1.data.hits.total.value,
    });
  }, [getQueryByType, lastBlock]);

  console.log({ lastBlock });

  useEffect(() => {
    handleGetData();
  }, [handleGetData]);

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
          defaultValue={OPTION_AMOUNT[0].value}
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
          defaultValue={OPTION_TIME[0].value}
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

      <PieChart data={dataPie} />
      <BarGroupChart />
    </Box>
  );
};

export default GroupChart;
