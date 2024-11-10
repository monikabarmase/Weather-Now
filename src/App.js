// src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to fetch weather data
  const fetchWeather = async () => {
    if (!city) return;

    setLoading(true);
    setError("");

    try {
      // Open-Meteo API URL
      const url = `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.4050&current_weather=true`;
      const response = await axios.get(url);
      setWeatherData(response.data.current_weather);
    } catch (err) {
      setError("Failed to fetch weather data.");
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission to get the weather
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather();
  };

  return (
    <div className="App">
      <h1>Weather Now</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Get Weather</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {weatherData && (
        <div>
          <h3>Current Weather:</h3>
          <p>Temperature: {weatherData.temperature}°C</p>
          <p>Wind Speed: {weatherData.windspeed} km/h</p>
          <p>Weather: {weatherData.weathercode}</p>
        </div>
      )}
    </div>
  );
}

export default App;
