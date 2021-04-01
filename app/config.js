export const PORT = process.env.PORT ?? 3000

export const DATABASE_ADDRESS = process.env.DATABASE_ADDRESS ?? '127.0.0.1'
export const DATABASE_USER = process.env.DATABASE_USER ?? 'root'
export const DATABASE_DB = process.env.DATABASE_DB ?? 'webweather'
export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD ?? 'password'
export const MAX_CONNECTION_ATTEMPTS = process.env.MAX_CONNECTION_ATTEMPTS ?? 5

export const WEATHER_API_KEY = 'b0555787759c4e8382148ae636958af2'
export const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather'