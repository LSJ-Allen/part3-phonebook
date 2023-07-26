const mongoose = require('mongoose')

const password = process.argv[2]
const url = `mongodb+srv://Allen:${password}@firstdb.skqzu2r.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

// if the command line has 5 arguements
if(process.argv.length === 5){
  const name = process.argv[3]
  const number = process.argv[4]

  const newPerson = new Person({
    name: name,
    number: number
  })

  newPerson.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close()
  })
} 
else if(process.argv.length === 3){
  console.log('phonebook:')
  Person.find({}).then(result =>{
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else {
  console.log('Bad command')
}