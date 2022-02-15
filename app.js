const express = require('express')
const { getTopics, getArticleById } = require('./controllers/controllers.js')
const { handleCustomErrors, handlePsqlErrors } = require('./errors/index.js')

const app = express()
app.use(express.json())

app.all('/api', (req, res) => {
    res.status(200).send( { msg: "OK" } )
})

app.get('/api/topics', getTopics)
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles/notAnId')


app.all('/*', (req, res) => {
    res.status(404).send( { msg: "PATH REQUESTED NOT FOUND" } )
})

app.use(handleCustomErrors)
app.use(handlePsqlErrors)

module.exports = app