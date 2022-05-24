import React from 'react';

import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const BarGroupChart = () => {
  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Table title',
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  const labels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
  ];

  const data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: labels.map(() => Math.random(0, 20)),
        backgroundColor: '#FF6E40',
        stack: 'Stack 0',
      },
      {
        label: 'Dataset 3',
        data: labels.map(() => Math.random(0, 20)),
        backgroundColor: '#1DE9B6',
        stack: 'Stack 1',
      },
    ],
  };
  return <Bar options={options} data={data} />;
};

export default BarGroupChart;
