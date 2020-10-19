const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
    `mongodb+srv://farid555:${password}@cluster0.weiyl.mongodb.net/farid555?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,

})

const Person = mongoose.model('Person', personSchema)

if (name === undefined || number === undefined) {
    Person
        .find({})
        .then(persons => {
            console.log("Phonebook:")
            persons.map(person => console.log(person.name, person.number))
            mongoose.connection.close()
        })
} else {
    const person = new Person({
        name: name,
        number: number
    })


    person.save().then(result => {
        console.log(`the name ${name} and number ${number} was added inside the phonebook`)
        mongoose.connection.close()
    })
}