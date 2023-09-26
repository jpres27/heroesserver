const heroesRouter = require('express').Router()
const Hero = require('../models/hero')

heroesRouter.get('/', (request, response) => {
    Hero.find({}).then(heroes => {
        response.json(heroes)

    })
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

heroesRouter.post('/', (request, response) => {
    const body = request.body

    const hero = new Hero({
        name: body.name,
        sword: body.sword
    })

    hero.save().then(savedHero => {
        response.json(savedHero)
    })
    .catch(error => next(error))
})

module.exports = heroesRouter