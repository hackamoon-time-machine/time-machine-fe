import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import { Box, Tag, HStack } from '@chakra-ui/react';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const PieChart = ({ data }) => {
  const dataPie = useMemo(() => {
    return {
      labels: ['Sell', 'Buy'],
      datasets: [
        {
          label: 'My First Dataset',
          data: [data?.totalSell, data?.totalBuy],
          backgroundColor: ['#1DE9B6', '#FF6E40'],
          borderColor: '#141D24',
          hoverOffset: 4,
        },
      ],
    };
  }, [data]);

  const options = {
    plugins: {
      datalabels: {
        formatter: function (value) {
          if (!value) {
            return '';
          }
          let show =
            (value / (Number(data.totalBuy) + Number(data.totalSell))) * 100;

          return `${show.toFixed(3)}%`;
        },
        color: '#141D24',
        borderRadius: '6',
        font: {
          weight: '500',
          size: '14px',
          color: '#fff',
          padding: '4',
        },
      },
      legend: {
        position: 'top',
        align: 'center',
        display: !!data.totalBuy,
        labels: {
          usePointStyle: true,
          boxWidth: 50,
          padding: 20,
          color: '#D9D9D9',
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <Box mb={6}>
      <HStack>
        <Box position="relative" w="360px" h="360px">
          <Doughnut
            data={dataPie}
            plugins={[ChartDataLabels]}
            options={options}
          />
        </Box>
        {data.topBuy && data.topSell && (
          <Box>
            <Box mb="4" mr={4} display="flex" flexWrap="wrap">
              <Tag bg="#1DE9B6" color="#141D24">
                Top Buyer: {data.topBuy}
              </Tag>
            </Box>
            <Box display="flex" flexWrap="wrap">
              <Tag bg="#FF6E40" color="#141D24" mr="3">
                Top Seller: {data.topSell}
              </Tag>
            </Box>
          </Box>
        )}
      </HStack>
    </Box>
  );
};

export default PieChart;
