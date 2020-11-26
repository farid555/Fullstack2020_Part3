require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/persons')

app.use(express.json())
app.use(express.static('build'))
app.use(cors())


morgan.token('body', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  } else {
    return null
  }
})
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

app.get('/info', (req, res) => {
  Person.find({}).then((people) => {
    const info = `There is information of ${people.length} people in the phonebook.`
    const time = Date()
    res.send(`<p>${info}</p><p>${time}</p>`)
  })
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons.map((person) => person.toJSON()))
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })

    .catch((error) => next(error))
})
app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true })
    .then((updatedPerson) => {
      res.json(updatedPerson)
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (body.name === undefined) {
    return res.status(400).json({
      error: 'name is missing!',
    })
  }
  if (body.number === undefined) {
    return res.status(400).json({
      error: 'number is missing!',
    })
  }

  const person = new Person({
    id: Math.floor(Math.random() * 25),
    name: body.name,
    number: body.number,
  })
  person.save().then((savedPerson) => {
    res.json(savedPerson.toJSON)
  })
    .catch((error) => next(error))
})
const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformed id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
