import { useEffect, useRef, useState } from "react";
import "./Weather.css";
import search_icon from "../assets/search.png";
import clear_icon from "../assets/clear.png";
import cloud_icon from "../assets/cloud.png";
import drizzle_icon from "../assets/drizzle.png";
import rain_icon from "../assets/rain.png";
import snow_icon from "../assets/snow.png";
import wind_icon from "../assets/wind.png";
import mist_icon from "../assets/mist.png";
import sunrise from "../assets/sunrise.png";
import sunset from "../assets/sunset.png";
import humidity_icon from "../assets/humidity.png";

const Weather = () => {
	const inputRef = useRef();
	const [weatherData, setWeatherData] = useState(false);
	const [forecastData, setForecastData] = useState([]);
	const [unit, setUnit] = useState("metric");
	const [city, setCity] = useState("Lahore");

	const allIcons = {
		"01d": clear_icon,
		"01n": clear_icon,
		"50d": mist_icon,
		"50n": mist_icon,
		"02d": cloud_icon,
		"02n": cloud_icon,
		"03d": cloud_icon,
		"03n": cloud_icon,
		"04d": drizzle_icon,
		"04n": drizzle_icon,
		"09d": rain_icon,
		"09n": rain_icon,
		"10d": rain_icon,
		"10n": rain_icon,
		"13d": snow_icon,
		"13n": snow_icon,
	};

	const search = async (city) => {
		if (city === "") {
			alert("Enter city name");
			return;
		}
		try {
			setCity(city)
			// const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
			const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${
				import.meta.env.VITE_APP_ID
			}`;
			const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&cnt=8&appid=${
				import.meta.env.VITE_APP_ID
			}`;
			const [currentWeatherResponse, forecastResponse] = await Promise.all([
				fetch(currentWeatherUrl),
				fetch(forecastUrl),
			]);

			const currentWeatherData = await currentWeatherResponse.json();
			// console.log(currentWeatherData.weather[0].description);
			const forecastData = await forecastResponse.json();
			console.log(currentWeatherData);
			const icon = allIcons[currentWeatherData.weather[0].icon] || clear_icon;
			setWeatherData({
				humidity: currentWeatherData.main.humidity,
				windSpeed: currentWeatherData.wind.speed,
				temperature: Math.floor(currentWeatherData.main.temp),
				sunrise: currentWeatherData.sys.sunrise,
				sunset: currentWeatherData.sys.sunset,
				location: currentWeatherData.name,
				country: currentWeatherData.sys.country,
				mahool: currentWeatherData.weather[0].description,
				icon: icon,
			});
			setForecastData(forecastData.list);
		} catch (error) {
			console.error(error);
		}
	};
	const sunriseTimestamp = weatherData.sunrise; // Example timestamp
	const sunriseDate = new Date(sunriseTimestamp * 1000);
	const formattedSunriseTime = sunriseDate.toLocaleString("en-US", {
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	});
	const sunsetTimestamp = weatherData.sunset; // Example timestamp
	const sunsetDate = new Date(sunsetTimestamp * 1000);
	const formattedSunsetTime = sunsetDate.toLocaleString("en-US", {
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	});
	useEffect(() => {
		search(city);
	}, [unit]);

	return (
		<div className="weather">
			<div className="search-bar">
				<input type="text" ref={inputRef} placeholder="Search city" />
				<img
					src={search_icon}
					onClick={() => {
						search(inputRef.current.value);
					}}
					alt=""
				/>
			</div>
			{weatherData && (
				<>
					<img src={weatherData.icon} alt="" className="weather_icon" />
					<div className="flex">
						<span className="temp-unit" onClick={() => setUnit("imperial")}>
							Fahrenheit
						</span>
						<span className="temp-unit" onClick={() => setUnit("metric")}>
							Celcius
						</span>
					</div>
					<p className="temp">
						{weatherData.temperature}
						{unit === "metric" ? "°C" : "°F"}
					</p>
					<p className="mahool">{weatherData.mahool}</p>
					<p className="location">{weatherData.location}</p>
					<div className="weather-data">
						<div className="col">
							<img src={humidity_icon} alt="" />
							<div className="">
								<p>{weatherData.humidity} %</p>
								<span>Humidity</span>
							</div>
						</div>
						<div className="col">
							<img src={wind_icon} alt="" />
							<div className="">
								<p>
									{weatherData.windSpeed} {unit === "metric" ? "Km/h" : "M/h"}
								</p>
								<span>Wind Speed</span>
							</div>
						</div>
						<div className="col">
							<img src={sunrise} alt="" />
							<div className="">
								<p>{formattedSunriseTime}</p>
								<span>Sun rise</span>
							</div>
						</div>
						<div className="col">
							<img src={sunset} alt="" />
							<div className="">
								<p>{formattedSunsetTime}</p>
								<span>Sun set</span>
							</div>
						</div>
					</div>
				</>
			)}
			{forecastData.length > 0 && (
				<>
					<div className="forecast">
						<h2>Forecast</h2>
						<div className="forecast-grid">
							{forecastData.map((forecast, index) => {
								const icon = allIcons[forecast.weather[0].icon] || clear_icon;
								const date = new Date(forecast.dt_txt);
								const formattedDate = `${date.getDate()} ${date.toLocaleString(
									"default",
									{ month: "short" }
								)}`;
								return (
									<div key={index} className="forecast-item">
										{/* <p>{formattedDate}</p> */}
										<p>{new Date(forecast.dt_txt).toLocaleString()}</p>
										<img src={icon} alt="" className="forecast_icon" />
										<p>
											{Math.floor(forecast.main.temp)}
											{unit === "metric" ? "°C" : "°F"}
										</p>
										<p>{forecast.weather[0].description}</p>
									</div>
								);
							})}
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default Weather;
