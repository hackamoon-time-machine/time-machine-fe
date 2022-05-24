import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';

const PieChart = () => {
  const data = {
    labels: ['Red', 'Blue'],
    datasets: [
      {
        label: 'My First Dataset',
        data: [300, 50],
        backgroundColor: ['#1DE9B6', '#FF6E40'],
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
      },
      labels: {
        usePointStyle: true,
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};

export default PieChart;
