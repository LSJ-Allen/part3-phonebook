const express = require('express')
const app = express()
app.use(express.json())
let persons = [
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

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)

    if(person){
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.get('/info', (req, res) => {
    const reqTime = new Date()
    const numEntry = persons.length
    console.log(reqTime)
    res.send(
        `Phonebook has info for ${numEntry} people <br/> ${reqTime}`
    )
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
})

const generateId = () => {
    const maxId = persons.length > 0 ? Math.max(...persons.map(n=>n.id))
    : 0
    return maxId+1
}

app.post('/api/persons', (req, res) => {
    const body = req.body
    // console.log(req.body);
    const name = body.name
    const number = body.number
    const id = generateId()

    if(!name || !number){
        return res.status(400).json({
            error: 'name or number missing'
        })
    }

    // check if there is a repetition in names
    const sameName = persons.filter(p => p.name.localeCompare(name))
    if(sameName.length !== 0){
        return res.status(409).json({
            error: 'name must be unique'
        })
    }

    const newEntry = {
        name: name,
        number: number,
        id: id
    }
    // console.log(newEntry);
    persons = persons.concat(newEntry)
    res.json(newEntry)
})
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})