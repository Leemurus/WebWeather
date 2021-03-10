const API_KEY = 'b0555787759c4e8382148ae636958af2';

function getWeatherByCityName(cityName) {
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`;
    return doRequest(url);
}

function getWeatherByGeolocation(lat, lon) {
    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    return doRequest(url);
}

function doRequest(url) {
    return fetch(url).then(response => {
        return response.json();
    }).catch(e => {
        console.log(`There has been a problem with your fetch operation for resource "${url}": ` + e.message)
    });
}