// src/pages/Weather.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaThermometerHalf, FaTint, FaCloudRain, FaWind, FaSmog } from "react-icons/fa";
import "../Weather.css";
import WeatherChart from "./WeatherChart";

const API_KEY = "e0ea7c2430957c0b90c7a6375a5f8cba";

const Weather = () => {
  const [city, setCity] = useState("Hanoi");
  const [weatherData, setWeatherData] = useState(null);
  const [airQualityData, setAirQualityData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        const airQualityResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${weatherResponse.data.coord.lat}&lon=${weatherResponse.data.coord.lon}&appid=${API_KEY}`
        );

        const forecastResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );

        setWeatherData(weatherResponse.data);
        setAirQualityData(airQualityResponse.data.list[0]);
        setForecastData(forecastResponse.data.list);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeather();
  }, [city]);

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  if (loading) {
    return (
        <div className="loading-container">
            <div className="loading-message">Loading weather data...</div>
        </div>
    );
  }

  return (
    <div className="weather-container">
      <h1 className="weather-title">Weather Dashboard</h1>

      {/* City Input */}
      <div className="city-input">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={handleCityChange}
        />
        <button onClick={() => setLoading(true)}>Search</button>
      </div>

      {/* Current Weather Details */}
      <div className="weather-details">
        <div className="weather-card">
          <FaThermometerHalf size={40} color="#f39c12" />
          <h3>Temperature</h3>
          <p>Current: {weatherData.main.temp}°C</p>
          <p>Feels Like: {weatherData.main.feels_like}°C</p>
          <p>Max: {weatherData.main.temp_max}°C</p>
          <p>Min: {weatherData.main.temp_min}°C</p>
        </div>

        <div className="weather-card">
          <FaTint size={40} color="#3498db" />
          <h3>Humidity</h3>
          <p>{weatherData.main.humidity}%</p>
        </div>

        <div className="weather-card">
          <FaCloudRain size={40} color="#95a5a6" />
          <h3>Rain</h3>
          <p>{weatherData.rain ? `${weatherData.rain["1h"]} mm (1h)` : "No rain"}</p>
          <p>{weatherData.rain ? `${weatherData.rain["3h"]} mm (3h)` : ""}</p>
        </div>

        <div className="weather-card">
          <FaWind size={40} color="#1abc9c" />
          <h3>Wind</h3>
          <p>{weatherData.wind.speed} m/s</p>
        </div>

        <div className="weather-card">
          <FaSmog size={40} color="#7f8c8d" />
          <h3>Air Quality</h3>
          <p>PM2.5: {airQualityData.components.pm2_5} µg/m³</p>
          <p>PM10: {airQualityData.components.pm10} µg/m³</p>
        </div>
      </div>

      {/* Weather Forecast Chart */}
      <WeatherChart forecastData={forecastData} />
    </div>
  );
};

export default Weather;