const mongoose = require('mongoose')

mongoose.set('strictQuery', false)


const entrySchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'Name must be at least 3 characters long, got {VALUE}'],
    required: true
  },
  number: {
    type: String,
    minLength: [8, 'Number must be at least 8 characters long, got {VALUE}'],
    validate: {
      validator: function(v) {
        return /^\d{2,3}-\d+$/.test(v)
      },
      message: props => `${props.value} is not a valid phone number.`,
    },
    required: [true, 'User phone number required']
  }
})

entrySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Entry', entrySchema)