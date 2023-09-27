const heroesRouter = require('express').Router()
const Hero = require('../models/hero')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '')
    }
    return null
}

heroesRouter.get('/', async (request, response) => {
    const heroes = await Hero.find({}).populate('user', { username: 1 })

    response.json(heroes)
})

heroesRouter.get('/:id', (request, response, next) => {
    Hero.findById(request.params.id).then(hero => {
        if (hero) {
            response.json(hero)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

heroesRouter.put('/:id', (request, response, next) => {
    const { name, sword } = request.body

    Hero.findByIdAndUpdate(request.params.id, { name, sword }, {new: true, runValidators: true, context: 'query'}).then(updatedHero => {
        response.json(updatedHero)
    })
    .catch(error => next(error))
})

heroesRouter.delete('/:id', (request, response) => {
    Hero.findByIdAndRemove(request.params.id).then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

heroesRouter.post('/', async (request, response) => {
    const body = request.body
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'invalid token' })
    }
    const user = await User.findById(decodedToken.id)

    const hero = new Hero({
        name: body.name,
        sword: body.sword,
        user: user.id
    })

    const savedHero = await hero.save()
    user.heroes = user.heroes.concat(savedHero._id)
    await user.save()

    response.json(savedHero)
})

module.exports = heroesRouter