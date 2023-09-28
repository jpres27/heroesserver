const config = require('./utils/config')
const express = require('express')
const app = express()
const session = require('express-session')
const redis = require('redis')
const RedisStore = require('connect-redis').default
const cors = require('cors')
const usersRouter = require('./controllers/users')
const heroesRouter = require('./controllers/heroes')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const loginRouter = require('./controllers/login')
const mongoose = require('mongoose')

const redisClient = redis.createClient({
    password: process.env.REDIS_AUTH,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
})

redisClient.connect().then(() => {
    logger.info('connected to Redis')
})
.catch((error) => {
    logger.error('error connecting to Redis, error.message')
})

let redisStore = new RedisStore({
    client: redisClient
})

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI).then(() => {
    logger.info('connected to MongoDB')
})
.catch((error) => {
    logger.error('error connecting to MongoDB', error.message)
})

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(session({
    store: redisStore,
    secret: process.env.REDIS_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: false,
        maxAge: 1000 * 60 * 60 * 24
    }
}))
app.use(middleware.requestLogger)
app.use('/api/users', usersRouter)
app.use('/api/heroes', heroesRouter)
app.use('/api/login', loginRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app