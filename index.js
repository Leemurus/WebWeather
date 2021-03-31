import express from 'express'
import path from 'path'
import mysql from 'mysql'
import {PORT, DATABASE_ADDRESS, DATABASE_DB, DATABASE_PASSWORD, DATABASE_USER} from './config.js'

const __dirname = path.resolve()
const app = express()

const pool = mysql.createPool({
    connectionLimit: 5,
    host: DATABASE_ADDRESS,
    user: DATABASE_DB,
    database: DATABASE_PASSWORD,
    password: DATABASE_USER
})

// Set inner variables
app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'templates'))

// Set middlewares
app.use(express.static(path.resolve(__dirname, 'static')))

// Set base routes
app.get('/', (req, res) => {
    pool.query("show tables", function(err, data) {
        console.log(err);
    });

    res.render('index')
})

// Start server
app.listen(PORT, () => {
    console.log(`Server has been started on port ${PORT}...`)
})