require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./modules/person.js')

const app = express()

app.use(express.json())
app.use(express.static('build'))
app.use(cors())
// morgan middleware
app.use(morgan((tokens, req, res) => {
    const reqType = tokens.method(req, res)

    // the return string is different if request type is post
    if(reqType.localeCompare("POST")===0){
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length', '-'),
            tokens['response-time'](req, res), 'ms',
            JSON.stringify(req.body)
        ].join(' ')
    } else{
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length', '-'),
            tokens['response-time'](req, res), 'ms'
        ].join(' ')
    }
}))

// error handlers
const errorHandler = (error, req, res, next) => {
    console.error(error.message);
    if(error.name === 'CastError'){
        return res.status(400).send({error: "malformatted id"})
    }
    else if(error.name === 'ValidationError'){
        return res.status(400).json({error: error.message})
    }
    next(error)
}

app.get('/api/persons', (req, res) => {
    Person.find({}).then(result => {
        // result.forEach(p => {
        //     console.log(p);
        // })
        res.send(result)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if(person){
                res.json(person)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.get('/info', (req, res) => {
    const reqTime = new Date()
    Person.find({}).then(persons => {
        const numEntry = persons.length
        res.send(
                `Phonebook has info for ${numEntry} people <br/> ${reqTime}`
            )
    })
    // const numEntry = persons.length
    // console.log(reqTime)
    // res.send(
    //     `Phonebook has info for ${numEntry} people <br/> ${reqTime}`
    // )
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

const generateId = () => {
    const maxId = persons.length > 0 ? Math.max(...persons.map(n=>n.id))
    : 0
    return maxId+1
}

app.post('/api/persons', (req, res, next) => {
    const body = req.body
    // console.log(req.body);
    const name = body.name
    const number = body.number
    
    if(body.name === undefined || body.number === undefined) {
        return res.status(400).json({error: 'name or number missing'})
    }

    const person = new Person({
        name: name,
        number: number
    })

    person.save().then(saved => {
        res.json(saved)
    })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    console.log(req.params.id)
    const updatedPerson = {
        name: req.body.name,
        number: req.body.number
    }
    Person.findByIdAndUpdate(req.params.id, updatedPerson, {new: true})
        .then(updated => {
            res.json(updated)
        })
        .catch(error => next(error))
})

app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})