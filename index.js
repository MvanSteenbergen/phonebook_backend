require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Entry = require('./models/entry')
const connectDB = require('./models/connectDB')

morgan.token('body', function (request) { return (JSON.stringify(request.body) !== '{}' ? JSON.stringify(request.body) : '' )})

const app = express()

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('dist'))

app.get('/api/persons', (request, response) => {
  Entry.find({}).then(phonebook => {
    response.json(phonebook)
  })
})

app.get('/info', (request, response, next) => {
  const currentDate = new Date()
  const time = currentDate.toString()
  Entry.find({})
    .then(phonebook => {
      response.send(`<p>The phonebook currently has ${phonebook.length} entries</p><br/>${time}`)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Entry.findById(request.params.id)
    .then(entry => {
      if (entry) {
        response.json(entry)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Entry.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Entry.findByIdAndUpdate(
    request.params.id, { name, number }, { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedEntry => {
      response.json(updatedEntry)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const entry = new Entry({
    name: body.name,
    number: body.number
  })

  entry.save().then(result => {
    response.json(result)
  })
    .catch(error => next(error))

})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if(error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT

connectDB.then(() => {
  app.listen(PORT, () => {
    console.log('Listening for requests.')
  })
})

console.log(`Server running on port ${PORT}`)