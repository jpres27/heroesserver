const heroesRouter = require('express').Router()
const Hero = require('../models/hero')
const User = require('../models/user')

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

    Hero.findById(request.params.id).then(hero => {
        if(hero.user.toString() === request.session.user.toString()) {
            Hero.findByIdAndUpdate(request.params.id, { name, sword }, {new: true, runValidators: true, context: 'query'}).then(updatedHero => {
                response.json(updatedHero)
            })
            .catch(error => next(error))
        } else {
            response.status(401).end()
        }
    })
})

heroesRouter.delete('/:id', async (request, response) => {
    
    const hero = await Hero.findById(request.params.id)
    if(hero.user.toString() === request.session.user.toString()) {
        Hero.findByIdAndRemove(request.params.id).then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
        const user = await User.findById(request.session.user)
        console.log(user.heroes)
        user.heroes = user.heroes.splice(user.heroes.indexOf(request.params.id), 1)
        await user.save()
    } else {
        response.status(401).end()
        }
    
})

heroesRouter.post('/', async (request, response) => {
    const body = request.body
    const user = await User.findById(request.session.user)
    const hero = new Hero({
        name: body.name,
        sword: body.sword,
        user: request.session.user
    })

    const savedHero = await hero.save()
    user.heroes = user.heroes.concat(savedHero._id)
    await user.save()

    response.json(savedHero)
})

module.exports = heroesRouter