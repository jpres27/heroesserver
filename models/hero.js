const mongoose = require('mongoose')

const heroSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    sword: {
        type: String,
        minLength: 3,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

heroSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Hero', heroSchema)