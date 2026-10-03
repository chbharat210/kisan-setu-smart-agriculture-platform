import { useEffect, useState } from 'react';
import {
  CloudSun,
  Droplets,
  Wind,
  Thermometer,
  Umbrella,
  Sun,
  CloudRain,
  MapPin,
  RefreshCw,
  Sprout
} from 'lucide-react';

const weatherCode = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Foggy',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Heavy drizzle',
  61: 'Light rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Light snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  80: 'Rain showers',
  81: 'Moderate rain showers',
  82: 'Heavy rain showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Heavy thunderstorm'
};

function getWeatherIcon(code) {
  if (code === 0 || code === 1) {
    return <Sun size={30} />;
  }

  if (code === 2 || code === 3) {
    return <CloudSun size={30} />;
  }

  if (code >= 51 && code <= 82) {
    return <CloudRain size={30} />;
  }

  return <CloudSun size={30} />;
}

function getFarmingAdvice(code, rainProbability) {
  if (rainProbability >= 70) {
    return {
      title: 'Rain expected',
      text:
        'Avoid unnecessary irrigation and consider delaying spraying activities. Make sure drainage channels are clear.'
    };
  }

  if (code >= 95) {
    return {
      title: 'Thunderstorm alert',
      text:
        'Avoid field activities during thunderstorms. Protect equipment, livestock and harvested produce.'
    };
  }

  if (code >= 51 && code <= 82) {
    return {
      title: 'Wet conditions',
      text:
        'Monitor field moisture and avoid unnecessary irrigation. Check crops for fungal disease after rainfall.'
    };
  }

  if (code === 0 || code === 1) {
    return {
      title: 'Good field conditions',
      text:
        'Weather is generally suitable for routine field activities. Monitor soil moisture before irrigation.'
    };
  }

  return {
    title: 'Moderate field conditions',
    text:
      'Continue regular crop monitoring and make irrigation decisions according to soil moisture.'
  };
}

export default function Weather() {
  const [location, setLocation] = useState('Firozabad');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const locations = {
    Firozabad: {
      latitude: 27.1592,
      longitude: 78.3957
    },
    Jaipur: {
      latitude: 26.9124,
      longitude: 75.7873
    },
    Delhi: {
      latitude: 28.6139,
      longitude: 77.2090
    },
    Lucknow: {
      latitude: 26.8467,
      longitude: 80.9462
    },
    Agra: {
      latitude: 27.1767,
      longitude: 78.0081
    }
  };

  const fetchWeather = async () => {
    setLoading(true);
    setError('');

    try {
      const selectedLocation = locations[location];

      const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${selectedLocation.latitude}` +
        `&longitude=${selectedLocation.longitude}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m` +
        `&hourly=precipitation_probability` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
        `&timezone=auto` +
        `&forecast_days=7`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Unable to fetch weather data.');
      }

      const data = await response.json();

      setWeather(data);
    } catch (err) {
      console.error(err);
      setError(
        'Unable to load weather information. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [location]);

  const current = weather?.current;

  const rainProbability =
    weather?.daily?.precipitation_probability_max?.[0] || 0;

  const advice = current
    ? getFarmingAdvice(
        current.weather_code,
        rainProbability
      )
    : null;

  return (
    <div className="weather-page">

      {/* Header */}

      <header className="feature-header weather-header">

        <div>

          <span className="eyebrow">
            SMART AGRICULTURE
          </span>

          <h1>
            Weather <em>Advisory</em>
          </h1>

          <p>
            Live weather information and farming guidance
            to help you make better field decisions.
          </p>

        </div>

        <div className="feature-header-icon">
          <CloudSun size={42} />
        </div>

      </header>

      <main className="weather-container">

        {/* Location selector */}

        <section className="weather-location-card">

          <div className="location-title">

            <div className="feature-icon">
              <MapPin size={20} />
            </div>

            <div>
              <h2>Farm Location</h2>
              <p>
                Select your farming location.
              </p>
            </div>

          </div>

          <div className="location-controls">

            <select
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
            >
              {Object.keys(locations).map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>

            <button
              className="refresh-weather"
              onClick={fetchWeather}
              disabled={loading}
            >
              <RefreshCw
                size={16}
                className={loading ? 'spin' : ''}
              />

              {loading ? 'Updating...' : 'Refresh'}
            </button>

          </div>

        </section>

        {/* Error */}

        {error && (
          <div className="weather-error">
            {error}
          </div>
        )}

        {/* Current weather */}

        {current && (

          <>
            <section className="current-weather">

              <div className="current-main">

                <div className="weather-icon-large">
                  {getWeatherIcon(
                    current.weather_code
                  )}
                </div>

                <div>
                  <span className="current-location">
                    {location}
                  </span>

                  <h2>
                    {Math.round(
                      current.temperature_2m
                    )}°C
                  </h2>

                  <p>
                    {weatherCode[
                      current.weather_code
                    ] || 'Weather information'}
                  </p>
                </div>

              </div>

              <div className="current-details">

                <div>
                  <Thermometer size={18} />
                  <span>Feels like</span>
                  <strong>
                    {Math.round(
                      current.apparent_temperature
                    )}°C
                  </strong>
                </div>

                <div>
                  <Droplets size={18} />
                  <span>Humidity</span>
                  <strong>
                    {current.relative_humidity_2m}%
                  </strong>
                </div>

                <div>
                  <Wind size={18} />
                  <span>Wind</span>
                  <strong>
                    {Math.round(
                      current.wind_speed_10m
                    )} km/h
                  </strong>
                </div>

                <div>
                  <Umbrella size={18} />
                  <span>Rain chance</span>
                  <strong>
                    {rainProbability}%
                  </strong>
                </div>

              </div>

            </section>

            {/* Farming advice */}

            {advice && (

              <section className="farming-weather-advice">

                <div className="weather-advice-icon">
                  <Sprout size={25} />
                </div>

                <div>
                  <span className="eyebrow">
                    FARMING RECOMMENDATION
                  </span>

                  <h2>
                    {advice.title}
                  </h2>

                  <p>
                    {advice.text}
                  </p>
                </div>

              </section>

            )}

            {/* 7 day forecast */}

            <section className="forecast-section">

              <div className="weather-section-heading">

                <div>
                  <h2>7-Day Forecast</h2>
                  <p>
                    Plan your agricultural activities
                    according to upcoming weather.
                  </p>
                </div>

              </div>

              <div className="forecast-grid">

                {weather.daily.time.map(
                  (date, index) => {

                    const day = new Date(date);

                    const dayName =
                      index === 0
                        ? 'Today'
                        : day.toLocaleDateString(
                            'en-US',
                            {
                              weekday: 'short'
                            }
                          );

                    const code =
                      weather.daily.weather_code[
                        index
                      ];

                    return (
                      <div
                        className="forecast-card"
                        key={date}
                      >

                        <span>
                          {dayName}
                        </span>

                        <div className="forecast-icon">
                          {getWeatherIcon(code)}
                        </div>

                        <strong>
                          {Math.round(
                            weather.daily
                              .temperature_2m_max[
                              index
                            ]
                          )}°
                        </strong>

                        <small>
                          {Math.round(
                            weather.daily
                              .temperature_2m_min[
                              index
                            ]
                          )}°
                        </small>

                        <p>
                          {weather.daily
                            .precipitation_probability_max[
                            index
                          ]}% rain
                        </p>

                      </div>
                    );
                  }
                )}

              </div>

            </section>

          </>
        )}

      </main>

    </div>
  );
}