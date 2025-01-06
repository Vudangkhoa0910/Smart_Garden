import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const WeatherChart = ({ forecastData }) => {
  const labels = forecastData.map((item) =>
    new Date(item.dt * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Temperature (°C)",
        data: forecastData.map((item) => item.main.temp),
        borderColor: "#f39c12",
        backgroundColor: "#f39c1266",
        fill: true,
      },
      {
        label: "Humidity (%)",
        data: forecastData.map((item) => item.main.humidity),
        borderColor: "#3498db",
        backgroundColor: "#3498db66",
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div>
      <h2>Forecast Chart</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default WeatherChart;
