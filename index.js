require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Hero = require('./models/hero')

app.use(express.json())
app.use(express.static('dist'))

app.get('/api/heroes', (request, response) => {
    Hero.find({}).then(heroes => {
        response.json(heroes)

    })
})

app.get('/api/heroes/:id', (request, response, next) => {
    Hero.findById(request.params.id).then(hero => {
        if (hero) {
            response.json(hero)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.put('/api/heroes/:id', (request, response, next) => {
    const { name, sword } = request.body

    Hero.findByIdAndUpdate(request.params.id, { name, sword }, {new: true, runValidators: true, context: 'query'}).then(updatedHero => {
        response.json(updatedHero)
    })
    .catch(error => next(error))
})

app.delete('/api/heroes/:id', (request, response) => {
    Hero.findByIdAndRemove(request.params.id).then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/heroes', (request, response) => {
    const body = request.body
    console.log(body)
    console.log(body.name)
    console.log(body.sword)

    const hero = new Hero({
        name: body.name,
        sword: body.sword
    })

    hero.save().then(savedHero => {
        response.json(savedHero)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformed id'})
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message})
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)