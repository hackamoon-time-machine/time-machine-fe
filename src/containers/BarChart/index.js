import React from 'react';

import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const BarGroupChart = () => {
  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
        grid: {},
      },
      y: {
        stacked: true,
        grid: {
          color: '#41596C',
          drawBorder: true,
          drawOnChartArea: true,
        },
        ticks: {
          count: 6,
        },
        pointLabels: {
          color: '#fff',
        },
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
        label: 'Dataset 3',
        data: labels.map(() => Math.random(0, 20)),
        backgroundColor: '#1DE9B6',
        stack: 'Stack 1',
      },
      {
        label: 'Dataset 1',
        data: labels.map(() => Math.random(0, 20)),
        backgroundColor: '#FF6E40',
        stack: 'Stack 0',
      },
    ],
  };
  return <Bar options={options} data={data} />;
};

export default BarGroupChart;
