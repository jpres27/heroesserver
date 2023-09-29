const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body
    console.log('Login request: ', request.body)
    
    const user = await User.findOne({ username })
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        console.log('invalid user or password')
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }
    request.session.regenerate(function (err) {
        console.log('Username and password match, beginning login')
        if (err) next(err)
        request.session.user = user._id
        console.log('Sesh.user: ', request.session.user)
        request.session.save(function (err) {
            if (err) return next(err)
            response.status(200).send({ username: user.username, name: user.name })
        })
    })
    console.log('login successful')
})

module.exports = loginRouter