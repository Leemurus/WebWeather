import express from 'express'
import path from 'path'

const __dirname = path.resolve()
const PORT = process.env.PORT ?? 3000
const app = express()

// Set inner variables
app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'templates'))

// Set middlewares
app.use(express.static(path.resolve(__dirname, 'static')))

// Set base routes
app.get('/', (req, res) => {
    res.render('index')
})

// Start server
app.listen(PORT, () => {
    console.log(`Server has been started on port ${PORT}...`)
})