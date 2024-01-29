const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

morgan.token('body', function (req, res) { return (JSON.stringify(req.body) !== "{}" ? JSON.stringify(req.body) : '' )})

const app = express()

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('dist'))


let phonebook = [
  {
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

const generateId = () => {
  return Math.floor(Math.random() * 1000000)
}

app.get('/api/persons', (request, response) => {
  response.json(phonebook)
})

app.get('/info', (request, response) => {
  const currentDate = new Date()
  const time = currentDate.toString()

  response.send(`<p>The phonebook currently has ${phonebook.length} entries</p><br/>${time}`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const number = phonebook.find(number => number.id === id)
  response.json(number)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  phonebook = phonebook.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body


  if(!body.name || !body.number) {
    return response.status(400).json({
      error: `name or number is missing`
    })
  }

  const names = phonebook.map((entry) => entry.name)
  
  // if name is already in array
  if(names.indexOf(body.name) != -1) {
    return response.status(400).json({
      error: `name is already in array`
    })
  }

  const entry = {
    "id": generateId(),
    "name": body.name,
    "number": body.number
  }

  phonebook = phonebook.concat(entry)
  response.json(phonebook)
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)