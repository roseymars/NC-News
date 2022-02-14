const express = require('express')
const { getTopics } = require('./controllers/controllers.js')
const { handleCustomErrors } = require('./errors/index.js')

const app = express()
app.use(express.json())

app.all('/api', (req, res) => {
    res.status(200).send( { msg: "OK" } )
})

app.get('/api/topics', getTopics)


app.all('/*', (req, res) => {
    res.status(404).send( { msg: "NOT FOUND" } )
})

app.use(handleCustomErrors)

module.exports = app