const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://fullstack:${password}@cluster0-ostce.mongodb.net/persons?retryWrites=true`
//`mongodb+srv://fullstack:<PASSWORD>@cluster0-ostce.mongodb.net/note-app?retryWrites=true`
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String

})

//const Note = mongoose.model('Note', personSchema)


const Person = mongoose.model('Person', personSchema)

if (name === undefined || number === undefined) {
  Person
    .find({})
    .then(persons => {
      console.log('Phonebook: ')
      persons.map(person => console.log(person.name, person.number))
      mongoose.connection.close()
    })
} else {
  const person = new Person({
    name: name,
    number: number
  })

  person.save().then(() => {
    console.log(`the name ${name} and number ${number} was added to the phonebook`)
    mongoose.connection.close()
  })
}