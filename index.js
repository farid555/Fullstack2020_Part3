const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(morgan('tiny'))




let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Adi Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Danil Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})
app.get('/info', (req, res) => {
    const info = `There is information of ${persons.length} people in the phonebook.`
    const time = Date()
    res.send(`<p>${info}</p><p>${time}</p>`)
})
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)

    res.status(204).end()
})




/*const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id))
        : 0
    return maxId + 1
}*/

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'content is missing'
        })
    }
    if (!persons.every(p => p.name !== body.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }



    const person = {
        id: Math.floor(Math.random() * 25),
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person)

    res.json(person)
})
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

