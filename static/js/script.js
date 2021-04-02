const favoriteCityForm = document.forms['add-favorite-city'];
const refreshButton = document.getElementsByClassName('refresh-geolocation')[0];
const favoriteCitiesList = document.getElementsByClassName('favorite-cities-list')[0];
const currentCity = document.getElementsByClassName('main-city-container')[0];

//  ======================================== EVENTS ========================================

favoriteCityForm.addEventListener('submit', function (e) {
    const cityInput = document.getElementById('favorite-city-name');
    addFavoriteCity(cityInput.value, false);
    cityInput.value = '';
    e.preventDefault();
});

favoriteCitiesList.addEventListener('click', async function (event) {
    if (!event.target.className.includes('remove-city-button')) {
        return;
    }

    changeRemoveButtonState(event.target.closest('li'), true);
    const cityId = event.target.closest('li').id.split('_')[1];
    const isRemoved = await deleteFavoriteCityById(cityId);
    if (!isRemoved) {
        changeRemoveButtonState(event.target.closest('li'), false);
    }
});

refreshButton.addEventListener('click', function () {
    unsetNoConnectionOnCurrentCity();
    setLoaderOnCurrentCity();
    loadCoordinatesFromGeolocationAPI();
});

document.addEventListener('DOMContentLoaded', function () {
    setLoaderOnCurrentCity();
    loadCoordinatesFromGeolocationAPI();
    loadFavorites();
});

async function updateFavicon(weatherData) {
    document.getElementById('favicon').href = getWeatherIcon(weatherData);
}

function loadCoordinatesFromGeolocationAPI() {
    navigator.geolocation.getCurrentPosition(function (position) {
        updateCurrentCityInformation({
            'latitude': position.coords.latitude,
            'longitude': position.coords.longitude
        });
    }, function (e) {
        updateCurrentCityInformation({
            'latitude': 59.957216,
            'longitude': 30.308178
        });
        console.warn(`There has been a problem with access to geolocation: ` + e.message)
    });
}

async function updateCurrentCityInformation(coordinates) {
    let weatherData = await getWeatherByCoordinates(coordinates['latitude'], coordinates['longitude'])

    if (!weatherData && !navigator.onLine) {
        unsetLoaderOnCurrentCity();
        setNoConnectionOnCurrentCity();
    } else {
        updateFavicon(weatherData);
        updateCurrentCityBriefInformation(weatherData);
        updateFullWeatherInformation(currentCity, weatherData);
        unsetLoaderOnCurrentCity();
    }
}


async function addFavoriteCity(cityName, fromDatabase) {
    const favoriteCityElement = renderEmptyFavoriteCity();
    favoriteCitiesList.appendChild(favoriteCityElement);
    let weatherData = await getWeatherByCityName(cityName);

    if (!weatherData && !navigator.onLine) {
        alert('Your internet connection was broken.');
        favoriteCityElement.remove()
        return;
    }

    if (!weatherData) {
        alert('City name is incorrect or information is missing.');
        favoriteCityElement.remove()
        return;
    }

    let cityId = null;
    if (!fromDatabase) {
        cityId = await addCityToFavorites(weatherData['name'])
    } else {
        cityId = await getCityIdByCityName(weatherData['name'])
    }

    if (cityId == null) {
        alert('You already have this city in favorites');
        favoriteCityElement.remove()
        return;
    }

    favoriteCityElement.id = `favorite_${cityId}`;
    updateFavoriteCityBriefInformation(favoriteCityElement, weatherData);
    updateFullWeatherInformation(favoriteCityElement, weatherData);
    unsetLoaderOnFavoriteCity(cityId);
}

async function deleteFavoriteCityById(cityId) {
    await deleteCityFromFavorites(cityId);

    if(!navigator.onLine) {
        alert('Your internet connection was broken.');
        return false;
    }

    deleteFavoriteCityByIdFromUI(cityId);
    return true
}

function deleteFavoriteCityByIdFromUI(cityId) {
    const cityObject = document.getElementById(`favorite_${cityId}`);
    cityObject.remove();
}

//  ======================================== FRONTEND UPDATING ========================================

function updateCurrentCityBriefInformation(weatherData) {
    currentCity.getElementsByClassName('city-name')[0].textContent = weatherData['name'];
    currentCity.getElementsByClassName('weather-icon')[0].src = getWeatherIcon(weatherData);
    currentCity.getElementsByClassName('temperature-number')[0].innerHTML = `${Math.round(weatherData['main']['temp_min'])} &deg;C`;
}

function updateFavoriteCityBriefInformation(favoriteCityElement, weatherData) {
    const briefWeatherElement = favoriteCityElement.getElementsByClassName('brief-weather-information')[0];
    briefWeatherElement.getElementsByClassName('city-name')[0].textContent = weatherData['name'];
    briefWeatherElement.getElementsByClassName('temperature-number')[0].innerHTML = `${Math.round(weatherData['main']['temp_min'])} &deg;C`;
    briefWeatherElement.getElementsByClassName('weather-icon')[0].src = getWeatherIcon(weatherData);
}

function updateFullWeatherInformation(favoriteCityElement, weatherData) {
    const fullWeatherElement = favoriteCityElement.getElementsByClassName('full-weather-information')[0];
    fullWeatherElement.getElementsByClassName('wind')[0].getElementsByClassName('value')[0].textContent = `${weatherData['wind']['speed']} m/s, ${weatherData['wind']['deg']} deg`;
    fullWeatherElement.getElementsByClassName('cloudy')[0].getElementsByClassName('value')[0].textContent = weatherData['weather'][0]['main'];
    fullWeatherElement.getElementsByClassName('pressure')[0].getElementsByClassName('value')[0].textContent = `${weatherData['main']['pressure']} hpa`;
    fullWeatherElement.getElementsByClassName('humidity')[0].getElementsByClassName('value')[0].textContent = `${weatherData['main']['humidity']}%`;
    fullWeatherElement.getElementsByClassName('coordinates')[0].getElementsByClassName('value')[0].textContent = `[${weatherData['coord']['lat']}, ${weatherData['coord']['lon']}]`;
}

function renderEmptyFavoriteCity() {
    const template = document.getElementById('favorite-city-template');
    return document.importNode(template.content.firstElementChild, true);
}

//  ======================================== LOADER ========================================

function setNoConnectionOnCurrentCity() {
    if (!currentCity.classList.contains('connection_lost')) {
        currentCity.classList.add('connection_lost');
    }
}

function unsetNoConnectionOnCurrentCity() {
    currentCity.classList.remove('connection_lost');
}

function setLoaderOnCurrentCity() {
    if (!currentCity.classList.contains('loader-on')) {
        currentCity.classList.add('loader-on');
    }
}

function unsetLoaderOnCurrentCity() {
    currentCity.classList.remove('loader-on');
}

function changeRemoveButtonState(favoriteCityElement, state) {
    favoriteCityElement.getElementsByClassName('remove-city-button')[0].disabled = state;
}

function unsetLoaderOnFavoriteCity(cityId) {
    const cityObject = document.getElementById(`favorite_${cityId}`);
    cityObject.classList.remove('loader-on');
}