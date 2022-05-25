import React, { useCallback, useContext, useEffect, useState } from 'react';
import PieChart from 'containers/PieChart';
import BarGroupChart from 'containers/BarChart';
import { Box, Heading, Select, HStack, Button } from '@chakra-ui/react';
import {
  OPTION_AMOUNT,
  OPTION_TIME,
  SELL_KEY,
  BUY_KEY,
} from 'constants/global';
import axios from 'axios';
import { TradesContext } from 'contexts/Trades';
import useGetMaxBlock from 'hooks/useGetMaxBlock';
import { getQueryByType as getQueryByTypeUtil } from 'utils';

const URL = 'https://neproxy-dev.krystal.team/temp-es/swaps_new/_search';
// const URL2 =
//   'https://time-machine.es.asia-southeast1.gcp.elastic-cloud.com:9243/swaps_new/_search';

const GroupChart = () => {
  const { token } = useContext(TradesContext);
  const { lastBlock } = useGetMaxBlock();

  const [params, setParams] = useState({
    amount: OPTION_AMOUNT[0].value,
    time: OPTION_TIME[0].value,
  });

  const [dataPie, setDataPie] = useState({
    totalBuy: 0,
    totalSell: 0,
  });

  const getQueryByType = useCallback(
    type => {
      return getQueryByTypeUtil(
        type,
        params.amount,
        params.time,
        lastBlock,
        token
      );
    },
    [params, lastBlock, token]
  );

  const handleGetData = useCallback(async () => {
    if (!lastBlock) {
      return;
    }
    try {
      const sellQuery = getQueryByType(SELL_KEY);
      const buyQuery = getQueryByType(BUY_KEY);

      const configAuth = {
        auth: {
          username: 'elastic',
          password: 'nQV5AQb4xLKgkQk09WpVk3VX',
        },
      };
      const [res1, res2] = await Promise.all([
        axios.post(
          URL,
          { ...sellQuery },
          {
            ...configAuth,
          }
        ),
        axios.post(
          URL,
          { ...buyQuery },
          {
            ...configAuth,
          }
        ),
      ]);

      setDataPie({
        totalBuy:
          params.amount !== 'token'
            ? res2.data.hits.total.value
            : res2.data.aggregations.total.value,
        totalSell:
          params.amount !== 'token'
            ? res1.data.hits.total.value
            : res1.data.aggregations.total.value,
      });
    } catch (e) {
      console.log(e);
    }
  }, [getQueryByType, lastBlock, params.amount]);

  // first call
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
          value={params.amount}
          onChange={e => setParams({ ...params, amount: e.target.value })}
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
          value={params.time}
          onChange={e => {
            setParams({ ...params, time: e.target.value });
          }}
        >
          {OPTION_TIME.map(option => {
            return (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            );
          })}
        </Select>
        <Button color="#fff" bg="dark.500" p={4} onClick={handleGetData}>
          Filter
        </Button>
      </HStack>

      <PieChart data={dataPie} />
      <BarGroupChart />
    </Box>
  );
};

export default GroupChart;
