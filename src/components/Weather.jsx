import React, { useState, useEffect } from 'react'
import './Weather.css'
import search from '../assets/Assets/search.png'
import clear from '../assets/Assets/clear.png'
import cloud from '../assets/Assets/cloud.png'
import drizzle from '../assets/Assets/drizzle.png'
import humidity from '../assets/Assets/humidity.png'
import rain from '../assets/Assets/rain.png'
import snow from '../assets/Assets/snow.png'
import wind from '../assets/Assets/wind.png'

const Weather = () => {
  // State Management
  const [city, setCity] = useState('')
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [unit, setUnit] = useState('metric') // 'metric' for °C, 'imperial' for °F

  const apiKey = import.meta.env.VITE_APP_ID

  // Weather icon mapping
  const weatherIcons = {
    '01d': clear, '01n': clear,
    '02d': cloud, '02n': cloud,
    '03d': cloud, '03n': cloud,
    '04d': cloud, '04n': cloud,
    '09d': rain, '09n': rain,
    '10d': rain, '10n': rain,
    '11d': rain, '11n': rain,
    '13d': snow, '13n': snow,
    '50d': drizzle, '50n': drizzle,
  }

  // Weather details array for map rendering
  const weatherDetails = weatherData ? [
    { id: 'humidity', label: 'Humidity', value: `${weatherData.main.humidity}%`, icon: humidity },
    { id: 'wind', label: 'Wind Speed', value: `${weatherData.wind.speed} ${unit === 'metric' ? 'm/s' : 'mph'}`, icon: wind },
    { id: 'feels-like', label: 'Feels Like', value: `${Math.round(weatherData.main.feels_like)}°${unit === 'metric' ? 'C' : 'F'}`, icon: clear },
    { id: 'pressure', label: 'Pressure', value: `${weatherData.main.pressure} hPa`, icon: cloud },
  ] : []

  // Fetch weather data
  const fetchWeather = async (cityName) => {
    if (!cityName.trim()) {
      setError('Please enter a city name')
      return
    }

    setLoading(true)
    setError('')
    setWeatherData(null)

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${unit}`
      )

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('City not found. Please try another city.')
        }
        throw new Error('Failed to fetch weather data')
      }

      const data = await response.json()
      setWeatherData(data)
      setCity(cityName)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Handle search button click
  const handleSearch = () => {
    fetchWeather(city)
  }

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchWeather(city)
    }
  }

  // Toggle temperature unit
  const toggleUnit = () => {
    const newUnit = unit === 'metric' ? 'imperial' : 'metric'
    setUnit(newUnit)
    
    // Refetch with new unit if weather data exists
    if (weatherData && city) {
      setLoading(true)
      fetchWeatherWithUnit(city, newUnit)
    }
  }

  // Fetch weather with specific unit
  const fetchWeatherWithUnit = async (cityName, selectedUnit) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${selectedUnit}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch weather data')
      }

      const data = await response.json()
      setWeatherData(data)
      setUnit(selectedUnit)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='weather'>
      {/* Search Bar */}
      <div className='search-bar'>
        <input
          type='text'
          placeholder='Search city name...'
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyPress={handleKeyPress}
          className='search-input'
        />
        <button className='search-btn' onClick={handleSearch}>
          <img src={search} alt='Search' />
        </button>

        {/* Unit Toggle */}
        <button className='unit-toggle' onClick={toggleUnit} title='Toggle between °C and °F'>
          {unit === 'metric' ? '°C' : '°F'}
        </button>
      </div>

      {/* Loading State */}
      {loading && <div className='loading-message'>Loading weather data...</div>}

      {/* Error State */}
      {error && <div className='error-message'>{error}</div>}

      {/* Weather Information */}
      {weatherData && !loading && (
        <>
          {/* Weather Container */}
          <div className='weather-container'>
            <div className='location-date'>
              <div className='location'>{weatherData.name}, {weatherData.sys.country}</div>
              <div className='date'>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>

            <div className='weather-main'>
              <div className='temperature-section'>
                <div className='weather-icon'>
                  <img 
                    src={weatherIcons[weatherData.weather[0].icon] || cloud} 
                    alt={weatherData.weather[0].description}
                  />
                </div>
                <div className='temperature-info'>
                  <h2>{Math.round(weatherData.main.temp)}°{unit === 'metric' ? 'C' : 'F'}</h2>
                  <div className='weather-description'>{weatherData.weather[0].description}</div>
                  <div className='weather-feel'>Feels like {Math.round(weatherData.main.feels_like)}°{unit === 'metric' ? 'C' : 'F'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Weather Details Grid - Using map() for rendering */}
          <div className='weather-details'>
            {weatherDetails.map((detail) => (
              <div key={detail.id} className='detail-card'>
                <div className='detail-icon'>
                  <img src={detail.icon} alt={detail.label} />
                </div>
                <div className='detail-label'>{detail.label}</div>
                <div className='detail-value'>{detail.value}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Initial State - No search yet */}
      {!weatherData && !loading && !error && (
        <div className='empty-state'>
          <div className='empty-icon'>🌤️</div>
          <h3>Welcome to Weather App</h3>
          <p>Search for a city to get started</p>
        </div>
      )}
    </div>
  )
}

export default Weather
