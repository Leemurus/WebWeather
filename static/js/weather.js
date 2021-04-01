const BASE_URL = window.location.origin;

function getWeatherByCityName(cityName) {
    const url = `${BASE_URL}/weather/city?q=${cityName}`;
    return doRequest(url);
}

function getWeatherByCoordinates(lat, lon) {
    const url = `${BASE_URL}/weather/coordinates/?lat=${lat}&lon=${lon}`;
    return doRequest(url);
}

function getWeatherIcon(weatherData) {
    return `https://openweathermap.org/img/wn/${weatherData['weather'][0]['icon']}@4x.png`
}

async function doRequest(url) {
    return fetch(url).then(response => {
        return response.json();
    }).catch(e => {
        console.warn(`There has been a problem with your fetch operation for resource "${url}": ` + e.message)
    });
}