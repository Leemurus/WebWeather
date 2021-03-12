const favoriteCityForm = document.forms['add-favorite-city'];
const refreshButton = document.getElementsByClassName('refresh-geolocation')[0];
const favoriteCitiesList = document.getElementsByClassName('favorite-cities-list')[0];
const currentCity = document.getElementsByClassName('main-city-container')[0];

//  ======================================== EVENTS ========================================

favoriteCityForm.addEventListener('submit', function (e) {
    const cityInput = document.getElementById('favorite-city-name');
    addFavoriteCity(cityInput.value);
    cityInput.value = '';
    e.preventDefault();
});

favoriteCitiesList.addEventListener('click', function (event) {
    if (!event.target.className.includes('remove-city-button')) {
        return;
    }

    const cityId = event.target.closest('li').id.split('_')[1];
    deleteFavoriteCityById(cityId);
});

refreshButton.addEventListener('click', function () {
    setLoaderOnCurrentCity();
    loadCoordinatesFromGeolocationAPI();
});

document.addEventListener('DOMContentLoaded', function () {
    initializeLocalStorage();
    setLoaderOnCurrentCity();
    loadCoordinatesFromGeolocationAPI();
    loadCitiesFromLocalStorage();
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
    updateFavicon(weatherData);
    updateCurrentCityBriefInformation(weatherData);
    updateFullWeatherInformation(currentCity, weatherData);
    unsetLoaderOnCurrentCity();
}


async function addFavoriteCity(cityName, fromStorage= false) {
    const cityId = fromStorage ? myStorage.getItem(cityName) : generateNewCityId();

    const favoriteCityElement = renderEmptyFavoriteCity(cityId);
    favoriteCitiesList.appendChild(favoriteCityElement);
    let weatherData = await getWeatherByCityName(cityName);

    if (weatherData['cod'] !== 200) {
        alert('City name is incorrect or information is missing.');
        deleteFavoriteCityByIdFromUI(cityId);
        return;
    }

    if (myStorage.getItem(weatherData['name']) !== null && !fromStorage) {
        alert('You already have this city in favorites');
        deleteFavoriteCityByIdFromUI(cityId);
        return;
    }

    myStorage.setItem(weatherData['name'], cityId);

    updateFavoriteCityBriefInformation(favoriteCityElement, weatherData);
    updateFullWeatherInformation(favoriteCityElement, weatherData);
    unsetLoaderOnFavoriteCity(cityId);
}

function deleteFavoriteCityById(cityId) {
    // We can't delete pair from storage by value - we need search the key
    for (let key of getCityListFromStorage()) {
        if (myStorage.getItem(key) === cityId) {
            myStorage.removeItem(key);
            break
        }
    }

    deleteFavoriteCityByIdFromUI(cityId);
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

function renderEmptyFavoriteCity(cityId) {
    const template = document.getElementById('favorite-city-template');
    const favoriteCityElement = document.importNode(template.content.firstElementChild, true);
    favoriteCityElement.id = `favorite_${cityId}`;
    return favoriteCityElement;
}

//  ======================================== LOADER ========================================

function setLoaderOnCurrentCity() {
    if (!currentCity.classList.contains('loader-on')) {
        currentCity.classList.add('loader-on');
    }
}

function unsetLoaderOnCurrentCity() {
    currentCity.classList.remove('loader-on');
}

function unsetLoaderOnFavoriteCity(cityId) {
    const cityObject = document.getElementById(`favorite_${cityId}`);
    cityObject.classList.remove('loader-on');
}