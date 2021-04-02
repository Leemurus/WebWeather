const BASE_URL = window.location.origin;

async function doRequest(url, data= {}) {
    return fetch(`${BASE_URL}${url}`, data).then(response => {
        return response.json();
    }).catch(e => {
        console.warn(`There has been a problem with your fetch operation for resource "${url}": ` + e.message)
        return null
    });
}