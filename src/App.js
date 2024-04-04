import './App.css';
import React, { useEffect, useState } from "react";
import { Dimmer, Loader } from 'semantic-ui-react';
import Weather from './components/weather';
import Forecast from './components/forecast';
export default function App() {
  
  const [lat, setLat] = useState([]);
  const [long, setLong] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
      navigator.geolocation.getCurrentPosition(function(position) {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
      });
    
      // eslint-disable-next-line
      getWeather(lat, long)
      .then(weather => {
        console.log('in fetchhhhh',weather);
        setWeatherData(weather);
        setError(null);
      })
      .catch(err => {
        setError(err.message);
      });

      // eslint-disable-next-line
      getForecast(lat, long)
        .then(data => {
          setForecast(data);
          setError(null);
        })
        .catch(err => {
          setError(err.message);
        });

  }, [])

  function handleResponse(response) {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Please Enable your Location in your browser!");
    }
  }

  // eslint-disable-next-line
  function getWeather(lat, long) {
    return fetch(
      `https://api.openweathermap.org/data/2.5/weather/?lat=25.5922166&lon=85.12761069999999&units=metric&APPID=cce5f57a1da1e61714237419c95ac579`
    )
      .then(res => handleResponse(res))
      .then(weather => {
        console.log('res--',weather);
        return weather;
      });
  }
  
  // eslint-disable-next-line
  function getForecast(lat, long) {
    return fetch(
      `$https://api.openweathermap.org/data/2.5/forecast/?lat=25.5922166&lon=85.12761069999999&units=metric&APPID=cce5f57a1da1e61714237419c95ac579`
    )
      .then(res => handleResponse(res))
      .then(forecastData => {
        if (Object.entries(forecastData).length) {
          return forecastData.list
            .filter(forecast => forecast.dt_txt.match(/09:00:00/));
        }
      });
  }
  
  return (
    <div className="App">
      {(weatherData.main != null) ? (
        <div>
          <Weather weatherData={weatherData}/>
          <Forecast forecast={forecast} weatherData={weatherData}/>
        </div>
      ): (
        <div>
          <Dimmer active>
            <Loader>Loading..</Loader>
          </Dimmer>
        </div>
      )}
    </div>
  );
}
