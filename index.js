require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Hero = require('./models/hero')

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

let heroes = [
    {
        name: "Ragnar",
        sword: "Tyrfing",
        id: 1
    }
]

app.get('/info', (request, response) => {
    const date = new Date()
    response.send(`${heroes.length} warriors are enshrined in the Hall of Heroes. </br> ${date}`)
})

app.get('/api/heroes', (request, response) => {
    Hero.find({}).then(heroes => {
        response.json(heroes)

    })
})

app.get('/api/heroes/:id', (request, response) => {
    Hero.findById(request.params.id).then(hero => {
        response.json(hero)
    })
})

app.delete('/api/heroes/:id', (request, response) => {
    const id = Number(request.params.id)
    heroes = heroes.filter(hero => hero.id !== id)

    response.status(204).end()
})

app.post('/api/heroes', (request, response) => {
    const body = request.body
    console.log(body)
    console.log(body.name)
    console.log(body.sword)
    
    if (body.name === undefined) {
        return response.status(400).json({
            error: 'There is no name in the request'
        })
    }

    if (body.sword === undefined) {
        return response.status(400).json({
            error: 'There is no sword in the request'
        })
    }

    const hero = new Hero({
        name: body.name,
        sword: body.sword
    })

    hero.save().then(savedHero => {
        response.json(savedHero)
    })
})

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)