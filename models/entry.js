const mongoose = require('mongoose')

mongoose.set('strictQuery', false)


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