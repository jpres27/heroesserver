const express = require('express')
const app = express()
const cors = require('cors')

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

const generateId= () => {
    const maxId = heroes.length > 0
        ? Math.max(...heroes.map(n => n.id))
        : 0
        return maxId + 1
}

app.get('/info', (request, response) => {
    const date = new Date()
    response.send(`${heroes.length} warriors are enshrined in the Hall of Heroes. </br> ${date}`)
})

app.get('/api/heroes', (request, response) => {
    response.json(heroes)
})

app.get('/api/heroes/:id', (request, response) => {
    const id = Number(request.params.id)
    const hero = heroes.find(hero => hero.id === id)

    if (hero) {
    response.json(hero)
    } else {
        response.status(404).end()
    }
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
    
    if (!body.name) {
        return response.status(400).json({
            error: 'There is no name in the request'
        })
    }


    if (!body.sword) {
        return response.status(400).json({
            error: 'There is no sword in the request'
        })
    }

    if (heroes.some(e => e.name === body.name)) {
        return response.status(400).json({
            error: 'This hero already resides within the great hall.'
        })
      }

    const hero = {
        name: body.name,
        sword: body.sword,
        id: generateId(),
    }

    heroes = heroes.concat(hero)
    response.json(hero)
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)