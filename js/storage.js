const myStorage = window.localStorage;

async function loadCitiesFromLocalStorage() {
    for (let key of getCityListFromStorage()) {
        addFavoriteCity(key, true);
    }
}

function generateNewCityId() {
    const cityId = myStorage.getItem('lastId');
    myStorage.setItem('lastId', Number.parseInt(myStorage.getItem('lastId')) + 1);
    return cityId;
}

function getCityListFromStorage() {
    let keys = Object.keys(myStorage).filter(item => item !== 'lastId');
    keys.sort(function (first, second) {
        return myStorage.getItem(first) - myStorage.getItem(second);
    });

    return keys;
}

function initializeLocalStorage() {
    if (myStorage.getItem('lastId') === null) {
        myStorage.setItem('lastId', 0);
    }
}