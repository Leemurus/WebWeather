const favoriteCityForm = document.forms['add-favorite-city'];
const geolocation = navigator.geolocation;

// Events
favoriteCityForm.addEventListener('submit', function (e) {
    const cityName = document.getElementById('favorite-city-name').value;
    addFavoriteCity(cityName);
    e.preventDefault();
});

document.addEventListener('DOMContentLoaded', function () {
    geolocation.getCurrentPosition(function(position) {
        console.log(position.coords.latitude, position.coords.longitude);
    });
});

async function addFavoriteCity(cityName) {
    let weatherData = await getWeatherByCityName(cityName);
    alert(JSON.stringify(weatherData));
}

