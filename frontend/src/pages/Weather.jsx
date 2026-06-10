import { useState } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'

const Weather = () => {
  const [location, setLocation] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const token = localStorage.getItem('token')

  const fetchWeather = async () => {
    if (!location) return
    setLoading(true)
    setError('')
    try {
      const res = await axios.get(
        `http://localhost:5000/api/weather/${location}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setWeather(res.data.weather)
    } catch {
      setError('Could not fetch weather. Check location name!')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-green-50">

      {/* Navbar */}
      <Navbar />

      <div className="max-w-2xl mx-auto p-6">

        <h1 className="text-2xl font-bold text-green-700 mb-6">
          🌦️ Weather Information
        </h1>

        {/* Search */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && fetchWeather()}
            placeholder="Enter city name (e.g. Punjab, Ludhiana)"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={fetchWeather}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? '...' : 'Search'}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
            ❌ {error}
          </div>
        )}

        {/* Weather Card */}
        {weather && (
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-6 rounded-2xl shadow-lg">

            {/* Location & Temp */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold">
                  {weather.location}, {weather.country}
                </h2>
                <p className="text-blue-200 capitalize mt-1">
                  {weather.description}
                </p>
              </div>
              <div className="text-right">
                <p className="text-6xl font-bold">{weather.temperature}°</p>
                <p className="text-blue-200 text-sm">
                  Feels like {weather.feelsLike}°
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white bg-opacity-20 p-4 rounded-xl">
                <p className="text-blue-200 text-sm">💧 Humidity</p>
                <p className="text-2xl font-bold">{weather.humidity}%</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-xl">
                <p className="text-blue-200 text-sm">💨 Wind Speed</p>
                <p className="text-2xl font-bold">{weather.windSpeed} m/s</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-xl">
                <p className="text-blue-200 text-sm">🌡️ Min Temp</p>
                <p className="text-2xl font-bold">{weather.minTemp}°C</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-xl">
                <p className="text-blue-200 text-sm">🌡️ Max Temp</p>
                <p className="text-2xl font-bold">{weather.maxTemp}°C</p>
              </div>
            </div>

            {/* Farming Tip */}
            <div className="mt-4 bg-white bg-opacity-20 p-4 rounded-xl">
              <p className="text-blue-200 text-sm mb-1">🌾 Farming Tip</p>
              <p className="text-sm">
                {weather.humidity > 70
                  ? '⚠️ High humidity — watch for fungal diseases in crops!'
                  : weather.humidity < 30
                  ? '💧 Low humidity — consider irrigation today!'
                  : '✅ Good weather conditions for farming today!'}
              </p>
            </div>

          </div>
        )}

        {/* Empty State */}
        {!weather && !error && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-6xl mb-4">🌤️</div>
            <p className="text-lg">Enter a city name to get weather info</p>
            <p className="text-sm mt-2">Try: Ludhiana, Delhi, Mumbai, Amritsar</p>
          </div>
        )}

      </div>
    </div>
  )
}

export default Weather