

'use client';
// Import necessary libraries
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, TimeScale, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns'; // Import adapter for date handling
// import { useContext } from 'react'
// import DataContext from '@/context/Data/DataContext'

// Register necessary Chart.js components
ChartJS.register(TimeScale, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);
const extractDateTime = (timestamp)=>{
  const dateObj = new Date(timestamp);

  // Extract the date part (YYYY-MM-DD)
  const date = dateObj.toISOString().split('T')[0];

  // Extract the time part (HH:MM:SS)
  const time = dateObj.toISOString().split('T')[1].split('Z')[0];

  // Print or use the extracted date and time
  // console.log("Date:", date);  // Date: 2024-10-11
  // console.log("Time:", time);  // Time: 14:45:30
  return date + " " + time;
}
const normalFormat= 'yyyy-MM-dd HH:mm';
const updateFormat= 'yyyy-MM-dd'
const BarChartWithTimestamp = ({data}) => {
  // const {myData,setData:setMyData} = useContext(DataContext);
  // console.log(myData);
  // console.log(data);
  const frequencyMap = {};
  // console.log(data);
  const startTime = data.length>0? data[data.length-1]['@timestamp']:'';
  const endTime = data.length>0? data[0]['@timestamp']:'';
  const date1 = new Date(startTime);
  const date2 = new Date(endTime);

// Calculate the difference in milliseconds
const differenceInMilliseconds = date2 - date1;

// Convert milliseconds to desired units
const differenceInSeconds = differenceInMilliseconds / 1000;
const differenceInMinutes = differenceInSeconds / 60;
const differenceInHours = differenceInMinutes / 60;
const differenceInDays = differenceInHours / 24;

  console.log(startTime);
  console.log(endTime);
  console.log(differenceInDays);
  let format=normalFormat;
  let val1=7;
  if(differenceInDays>2){
    format=updateFormat;
    val1=13
  }

  data.forEach(prev => {
    const dateString = prev['@timestamp'];
    const formattedDate = extractDateTime(dateString);
    let val=formattedDate.slice(0,formattedDate.length-val1);
    console.log(val);

    // Formatting the date to use it as the key for frequencyMap
    // const year = date.getFullYear();
    // const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so add 1
    // const day = String(date.getDate()).padStart(2, '0');
    // const hours = String(date.getHours()).padStart(2, '0');
    // const minutes = String(date.getMinutes()).padStart(2, '0');

    // const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;
    frequencyMap[val] = (frequencyMap[val] || 0) + 1;
  });

  // Extracting the keys and values from frequencyMap for x and y axis
  let xAxis = [];
  let yAxis = [];

  Object.entries(frequencyMap).forEach(([key, val]) => {
    // console.log(key);
    // console.log(val);
    if (key!="NaN-NaN-NaN NaN:NaN") {
      xAxis.push(key); // these will be time-based labels
      yAxis.push(val); // these are the corresponding values
    }
    
  });

  
  // Data for the chart
  const chartData = {
    labels: xAxis, // Time-based labels
    datasets: [
      {
        label: 'Frequency of Events',
        data: yAxis, // Data corresponding to the labels
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Options for the chart
  const options = {
    scales: {
      x: {
        type: 'time',  // Specify that the x-axis should be a time scale
        time: {
          unit: 'day',  // Adjust the unit to 'day', 'month', etc. based on your need
          tooltipFormat: format,
        },
        title: {
          display: true,
          text: 'Timestamp',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Frequency',
        },
      },
    },
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  return (
    <div>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChartWithTimestamp;