import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import { Box } from '@chakra-ui/react';
import { ellipsis } from 'utils';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const PieChart = ({ data }) => {
  const dataPie = useMemo(() => {
    if (data?.listBuys?.length) {
      return {
        labels: [
          'Sell',
          ...data.listBuys.slice(0, 2).map(e => ellipsis(e.key)),
          'Others',
        ],
        datasets: [
          {
            label: 'My First Dataset',
            data: [data?.totalSell, ...data.listBuys.map(e => e.doc_count)],
            backgroundColor: [
              '#1DE9B6',
              '#1bb486',
              '#1de9b6',
              '#74FEE7',
              '#FF6E40',
            ],
            borderColor: '#000',
            hoverOffset: 4,
          },
        ],
      };
    }
    return {
      labels: ['Sell', 'Buy'],
      datasets: [
        {
          label: 'My First Dataset',
          data: [data?.totalSell, data?.totalBuy],
          backgroundColor: ['#1DE9B6', '#FF6E40'],
          borderColor: '#000',
          hoverOffset: 4,
        },
      ],
    };
  }, [data]);

  const options = {
    plugins: {
      datalabels: {
        formatter: function (value) {
          return value;
        },
        color: '#ffffff',
      },
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
    chart: {
      width: 200,
    },
  };

  return (
    <Box>
      <Doughnut data={dataPie} plugins={[ChartDataLabels]} options={options} />;
    </Box>
  );
};

export default PieChart;
