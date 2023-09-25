const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url).then(result => {
    console.log('connected to database')
})
.catch((error) => {
    console.log('error connecting to database', error.message)
})

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