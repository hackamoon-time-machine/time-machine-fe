import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import { Box } from '@chakra-ui/react';

const PieChart = ({ data }) => {
  const dataPie = useMemo(
    () => ({
      labels: ['Sell', 'Buy'],
      datasets: [
        {
          label: 'My First Dataset',
          data: [data?.totalBuy, data?.totalSell],
          backgroundColor: ['#1DE9B6', '#FF6E40'],
          borderColor: '#000',
          hoverOffset: 4,
        },
      ],
    }),
    [data]
  );

  const options = {
    plugins: {
      legend: {
        position: 'right',
        align: 'center',
        display: true,
        labels: {
          usePointStyle: true,
          boxWidth: 50,
          padding: 40,
          color: '#D9D9D9',
        },
      },
    },
  };

  return (
    <Box>
      <Doughnut data={dataPie} options={options} />;
    </Box>
  );
};

export default PieChart;
