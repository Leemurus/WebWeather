import express from 'express'
import path from 'path'
import serverRoutes from './api/routes.js'
import {PORT} from './config.js'
import morgan from 'morgan'

const __dirname = path.resolve()
const app = express()

// Set inner variables
app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'templates'))

// Set middlewares
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(express.urlencoded({extended: false}))
app.use(morgan('combined'))
app.use(serverRoutes)

// Set base routes
app.get('/', (req, res) => {
    // TODO: Add cities to html file
    res.render('index')
})

// Start server
app.listen(PORT, () => {
    console.log(`Server has been started on port ${PORT}...`)
})