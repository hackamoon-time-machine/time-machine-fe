import React, { useCallback, useContext, useEffect, useState } from 'react';
import PieChart from 'containers/PieChart';
import BarGroupChart from 'containers/BarChart';
import { Box, Heading, Select, HStack } from '@chakra-ui/react';
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

  const [dataBar, setDataBar] = useState({ sellData: [], buyData: [] });

  const getQueryByType = useCallback(
    (type, typeBar) => {
      return getQueryByTypeUtil(
        type,
        params.amount,
        params.time,
        lastBlock,
        token,
        typeBar
      );
    },
    [params, lastBlock, token]
  );

  const handleGetData = useCallback(async () => {
    if (!lastBlock) {
      return;
    }
    try {
      const sellQuery = getQueryByType(SELL_KEY, 'pie');
      const buyQuery = getQueryByType(BUY_KEY, 'pie');

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

      let topBuy;
      let topSell;
      if (params.amount !== 'token') {
        topBuy = res2.data.aggregations.top_buyers.buckets[0].doc_count;
        topSell = res1.data.aggregations.top_buyers.buckets[0].doc_count;
      }
      setDataPie({
        totalBuy:
          params.amount !== 'token'
            ? res2.data.hits.total.value
            : res2.data.aggregations.total.value,
        totalSell:
          params.amount !== 'token'
            ? res1.data.hits.total.value
            : res1.data.aggregations.total.value,
        topBuy,
        topSell,
      });
    } catch (e) {
      console.log(e);
    }
  }, [getQueryByType, lastBlock, params.amount]);

  const handleGetDataBarChart = useCallback(async () => {
    if (!lastBlock) {
      return;
    }
    try {
      const sellQuery = getQueryByType(SELL_KEY, 'bar');
      const buyQuery = getQueryByType(BUY_KEY, 'bar');

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

      setDataBar({
        sellData: res1.data.aggregations.total_over_time.buckets || [],
        buyData: res2.data.aggregations.total_over_time.buckets || [],
      });
    } catch (e) {
      console.log(e);
    }
  }, [getQueryByType, lastBlock]);

  // first call
  useEffect(() => {
    handleGetData();
  }, [handleGetData]);

  useEffect(() => {
    handleGetDataBarChart();
  }, [handleGetDataBarChart]);

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
          w="180px"
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
          w="140px"
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
      </HStack>

      <PieChart data={dataPie} />
      {!!dataBar?.sellData?.length && !!dataBar?.buyData?.length && (
        <BarGroupChart data={dataBar} type={params.amount} />
      )}
    </Box>
  );
};

export default GroupChart;
