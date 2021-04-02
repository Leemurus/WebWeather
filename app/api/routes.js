import {Router} from "express"
import Favorites from '../db.js'
import {WEATHER_API_KEY, WEATHER_API_URL} from '../config.js'
import axios from "axios";

const router = Router()

const doRequestToWebWeather = async (url) => {
    return axios.get(url).then(response => {
        return response.data;
    })
}

router.get('/weather/city', async (req, res) => {
    const cityName = encodeURI(req.query.q)

    if (!cityName) {
        res.sendStatus(400)
        return
    }

    let result = undefined;
    try {
        result = await doRequestToWebWeather(`${WEATHER_API_URL}?q=${cityName}&units=metric&appid=${WEATHER_API_KEY}`)
    } catch (e) {
        res.sendStatus(e.response.status)
    }

    res.json(result)
})

router.get('/weather/coordinates', async (req, res) => {
    const lat = req.query.lat
    const lon = req.query.lon

    if (!lat || !lon) {
        res.sendStatus(400)
        return
    }

    let result = undefined
    try {
        result = await doRequestToWebWeather(`${WEATHER_API_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`)
    } catch (e) {
        res.sendStatus(e.response.status)
    }

    res.json(result)
})

// Favorites
router.get('/favorites', async (req, res) => {
    const cities = await Favorites.findAll()
    res.json(cities)
})

router.post('/favorites', async (req, res) => {
    const cityName = req.body.city

    if (!cityName) {
        res.sendStatus(400)
        return
    }

    let cityId = null
    try {
        await Favorites.create({city: cityName})
        cityId = (await Favorites.findOne({where: {city: cityName}})).dataValues.id
    } catch (e) {
        console.error("Can't add new city to the database: ", e)
        res.sendStatus(500)
        return
    }

    res.json(cityId)
})

router.delete('/favorites', async (req, res) => {
    const cityId = req.body.cityId

    if (!cityId) {
        res.sendStatus(400)
        return
    }

    try {
        await Favorites.destroy({
            where: {
                id: cityId
            }
        })
    } catch (e) {
        console.error("Can't delete city from the database: ", e)
        res.sendStatus(500)
        return
    }

    res.sendStatus(200)
})

export default router