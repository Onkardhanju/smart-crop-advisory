const axios = require('axios');

const getWeather = async (req, res) => {
  try {
    const { location } = req.params;

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          q: location,
          appid: process.env.WEATHER_API_KEY,
          units: 'metric'
        }
      }
    );

    const data = response.data;

    res.json({
      success: true,
      weather: {
        location: data.name,
        country: data.sys.country,
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        windSpeed: data.wind.speed,
        visibility: data.visibility / 1000,
        minTemp: Math.round(data.main.temp_min),
        maxTemp: Math.round(data.main.temp_max)
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Could not fetch weather data'
    });
  }
};

const getForecast = async (req, res) => {
  try {
    const { location } = req.params;

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast`,
      {
        params: {
          q: location,
          appid: process.env.WEATHER_API_KEY,
          units: 'metric',
          cnt: 5
        }
      }
    );

    const forecasts = response.data.list.map(item => ({
      time: item.dt_txt,
      temperature: Math.round(item.main.temp),
      description: item.weather[0].description,
      icon: item.weather[0].icon,
      humidity: item.main.humidity
    }));

    res.json({ success: true, forecasts });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Could not fetch forecast data'
    });
  }
};

module.exports = { getWeather, getForecast };