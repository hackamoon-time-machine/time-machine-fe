import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import { Box } from '@chakra-ui/react';

const PieChart = () => {
  const data = {
    labels: ['Red', 'Blue'],
    datasets: [
      {
        label: 'My First Dataset',
        data: [300, 50],
        backgroundColor: ['#1DE9B6', '#FF6E40'],
        borderColor: '#000',
        hoverOffset: 4,
      },
    ],
  };
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

  // const totalComplete = () => <div style={{ color: '#fff' }}>hello</div>;
  // const plugin = {
  //   id: 'custom_canvas_background_image',
  //   beforeDraw: chart => {
  //     if (totalComplete) {
  //       const ctx = chart.ctx;
  //       const { top, left, width, height } = chart.chartArea;
  //       const x = left + width / 2;
  //       const y = top + height / 2;
  //       ctx.draw(totalComplete, x, y);
  //     }
  //   },
  // };

  return (
    <Box>
      <Doughnut data={data} options={options} />;
    </Box>
  );
};

export default PieChart;
