const express = require('express')
const app = express()
const morgan = require('morgan')
const middleware = require('./utils/middleware')

const rootRoutes = require('./controllers/root')
const coinRoutes = require('./controllers/coins')

app.use(morgan('dev'))

app.use('/api/', rootRoutes)
app.use('/api/coins', coinRoutes)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app