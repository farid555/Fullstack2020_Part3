require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/persons')


app.use(express.json())
app.use(express.static('build'))
app.use(cors())


morgan.token('data', (req, res) => {

    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    } else {
        return null
    }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))






let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Adi Lovelace",
        number: "39-44-5323523",
        id: 2
    },
    {
        name: "Danil Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    }
]
app.get('/info', (req, res) => {

    const info = `There is information of ${persons.length} people in the phonebook.`
    const date = Date()
    res.send(`<p>${info}</p><p>${date}</p>`)
})


app.get('/api/persons', (req, res) => {

    Person.find({}).then(persons => {
        res.json(persons.map(person => person.toJSON()))
    })

})


/*app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)*/

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person)
            } else {
                res.status(404).end()
            }

        })
        .catch(error => next(error))
})


app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })

        .catch(error => next(error))
})
app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error))
})





/*const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id))
        : 0
    return maxId + 1
}*/

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (body.name === undefined) {
        return res.status(400).json({
            error: 'name is missing!'
        })
    }
    if (body.number === undefined) {
        return res.status(400).json({
            error: 'number is missing!'
        })
    }
    /*if (!persons.every(p => p.name !== body.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }*/


    const person = new Person({
        id: Math.floor(Math.random() * 25),
        name: body.name,
        number: body.number,
    })
    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
})
const errorHandler = (error, req, res, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformed id' })
    }
    next(error)
}
app.use(errorHandler)




const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

