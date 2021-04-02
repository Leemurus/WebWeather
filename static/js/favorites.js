async function getFavorites() {
    return doRequest('/favorites')
}

async function getCityIdByCityName(cityName) {
    return (await getSortedFavorites())[cityName]
}

async function addCityToFavorites(cityName) {
    return doRequest('/favorites', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({city: cityName})
    });
}

async function deleteCityFromFavorites(cityId) {
    return doRequest('/favorites', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({cityId: cityId})
    });
}

async function getSortedFavorites() {
    let favorites = await getFavorites() ?? {};
    const normalizedFavorites = {};
    for (let value of favorites) {
        normalizedFavorites[value.city] = value.id;
    }

    let keys = Object.keys(normalizedFavorites);

    keys.sort(function (first, second) {
        return favorites[first] - favorites[second];
    });

    favorites = {}
    for (let key of keys.values()) {
        favorites[key] = normalizedFavorites[key]
    }

    return favorites;
}

async function loadFavorites() {
    for (let key of Object.keys(await getSortedFavorites())) {
        addFavoriteCity(key, true);
    }
}