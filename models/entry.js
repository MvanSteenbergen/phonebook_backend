const mongoose = require('mongoose')

const url = process.env.mongoDB_URI

console.log('connecting to', url)

mongoose.set('strictQuery', false)
mongoose.connect(url)
    .then(result => {
        console.log('Connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const entrySchema = new mongoose.Schema({
    name: String,
    number: String,
})

entrySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Entry', entrySchema)