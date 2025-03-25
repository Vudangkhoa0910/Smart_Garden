// src/pages/Statistic.js
import React, { useState, useEffect } from 'react';
import { database } from '../firebase'; // Firebase config import
import { ref, onValue } from 'firebase/database'; // Firebase database import
import { Line } from 'react-chartjs-2'; // Import Chart.js for line charts
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'; // Import necessary modules for chart.js
import '../Statistic.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Statistics = () => {
  const [monthlyData, setMonthlyData] = useState({});
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Temperature (°C)',
        data: [],
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      },
      {
        label: 'Humidity (%)',
        data: [],
        borderColor: 'rgba(153, 102, 255, 1)',
        fill: false,
      },
    ],
  });

  const [advice, setAdvice] = useState('');
  const [isDataLoaded, setIsDataLoaded] = useState(false); // State to track if data is loaded

  // Fetch data from Firebase Realtime Database
  useEffect(() => {
    const monthlyDataRef = ref(database, 'monthlyData');
    const unsubscribe = onValue(monthlyDataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setMonthlyData(data);
        updateChartData(data);
        generateAdvice(data);
        setIsDataLoaded(true); // Set data loaded flag to true
      }
    });

    return () => unsubscribe();
  }, []);

  // Function to update chart data from monthlyData
  const updateChartData = (data) => {
    const currentMonth = new Date().getMonth();
    const currentMonthData = data[currentMonth];

    if (currentMonthData) {
      const temperatureData = currentMonthData.temperature || [];
      const humidityData = currentMonthData.humidity || [];
      
      // Set labels as day of the month (assuming data is collected daily)
      const labels = Array.from({ length: temperatureData.length }, (_, index) => index + 1);
      
      setChartData({
        labels: labels,
        datasets: [
          {
            label: 'Temperature (°C)',
            data: temperatureData,
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: false,
          },
          {
            label: 'Humidity (%)',
            data: humidityData,
            borderColor: 'rgba(153, 102, 255, 1)',
            fill: false,
          },
        ],
      });
    }
  };

  // Function to generate advice based on temperature and humidity
  const generateAdvice = (data) => {
    const currentMonth = new Date().getMonth();
    const currentMonthData = data[currentMonth];

    if (currentMonthData) {
      const temperatureData = currentMonthData.temperature || [];
      const humidityData = currentMonthData.humidity || [];

      // Calculate average temperature and humidity
      const avgTemp = calculateAverage(temperatureData);
      const avgHumidity = calculateAverage(humidityData);

      let adviceText = 'Based on the current conditions:';

      // Temperature advice
      if (avgTemp < 18) {
        adviceText += ' Temperature is too low. Consider heating the greenhouse.';
      } else if (avgTemp > 30) {
        adviceText += ' Temperature is too high. Consider cooling the greenhouse.';
      } else {
        adviceText += ' Temperature is ideal for most plants.';
      }

      // Humidity advice
      if (avgHumidity < 40) {
        adviceText += ' Humidity is low. Consider increasing humidity for plant health.';
      } else if (avgHumidity > 60) {
        adviceText += ' Humidity is high. Ensure proper ventilation.';
      } else {
        adviceText += ' Humidity is optimal for plant growth.';
      }

      setAdvice(adviceText);
    }
  };

  // Utility function to calculate average
  const calculateAverage = (data) => {
    if (data.length === 0) return '--';
    const sum = data.reduce((acc, value) => acc + value, 0);
    return (sum / data.length).toFixed(2);
  };

  return (
    <div className="statistics-container">
      <h2 className="statistics-title">Monthly Statistics & Advice</h2>
      
      {/* Display Data Analysis Before Chart */}
      {!isDataLoaded ? (
         <div className="loading-container">
            <div className="loading-message">Loading statistics data...</div>
        </div>
      ) : (
        <div>
          <div className="data-analysis">
            <h3>Data Analysis</h3>
            <div className="stats-cards">
              <div className="stat-card">
                <div className="stat-card-title">Average Temperature</div>
                <div className="stat-card-value">{calculateAverage(chartData.datasets[0].data)} °C</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-title">Average Humidity</div>
                <div className="stat-card-value">{calculateAverage(chartData.datasets[1].data)} %</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-title">Max Temperature</div>
                <div className="stat-card-value">{Math.max(...chartData.datasets[0].data)} °C</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-title">Max Humidity</div>
                <div className="stat-card-value">{Math.max(...chartData.datasets[1].data)} %</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-title">Min Temperature</div>
                <div className="stat-card-value">{Math.min(...chartData.datasets[0].data)} °C</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-title">Min Humidity</div>
                <div className="stat-card-value">{Math.min(...chartData.datasets[1].data)} %</div>
              </div>
            </div>
          </div>

          {/* Display Advice */}
          <div className="advice-container">
            <h3>Care Advice</h3>
            <p>{advice}</p>
          </div>

          {/* Line Chart */}
          <div className="chart-container">
            <Line data={chartData} options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: 'Temperature and Humidity Over the Month',
                },
                tooltip: {
                  mode: 'index',
                  intersect: false,
                },
                legend: {
                  position: 'top',
                },
              },
            }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;