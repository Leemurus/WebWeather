function getWeatherByCityName(cityName) {
    const url = `/weather/city?q=${cityName}`;
    return doRequest(url);
}

function getWeatherByCoordinates(lat, lon) {
    const url = `/weather/coordinates/?lat=${lat}&lon=${lon}`;
    return doRequest(url);
}

function getWeatherIcon(weatherData) {
    return `https://openweathermap.org/img/wn/${weatherData['weather'][0]['icon']}@4x.png`
}