// /src/components/WeatherApp.js

import React, { useState } from "react";
import axios from "axios";
import "../styles/WeatherApp.css"; // Ensure the path is correct

function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input change (city name)
  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset previous errors
    setLoading(true); // Show loading state

    if (!city) {
      setError("Please enter a city name.");
      setLoading(false);
      return;
    }

    try {
      // Step 1: Get latitude and longitude of the city using OpenCage API (Geocoding)
      const geoResponse = await axios.get(
        "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m"
      );

      // Handle case when no city results are returned
      if (geoResponse.data.results.length === 0) {
        setError("City not found.");
        setLoading(false);
        return;
      }

      // Extract latitude and longitude from geocoding API response
      const { lat, lng } = geoResponse.data.results[0].geometry;

      // Step 2: Fetch weather data using Open-Meteo API
      const weatherResponse = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`
      );

      // Set the weather data to the state
      setWeather(weatherResponse.data.current_weather);
    } catch (err) {
      console.error("Error fetching weather data:", err); // Log error for debugging
      setError("Failed to fetch weather data.");
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  return (
    <div className="weather-container">
      <h1>Weather Now</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={city}
          onChange={handleInputChange}
          placeholder="Enter city"
        />
        <button type="submit">Get Weather</button>
      </form>
      {loading && <p>Loading...</p>} {/* Show loading state */}
      {error && <p className="error">{error}</p>} {/* Display error message */}
      {weather && !error && (
        <div className="weather-info">
          <p>
            <strong>City:</strong> {city}
          </p>
          <p>
            <strong>Temperature:</strong> {weather.temperature}°C
          </p>
          <p>
            <strong>Weather:</strong> {weather.weathercode}
          </p>
          <p>
            <strong>Humidity:</strong> {weather.humidity}%
          </p>
          <p>
            <strong>Wind Speed:</strong> {weather.windspeed} km/h
          </p>
        </div>
      )}
    </div>
  );
}

export default WeatherApp;
