const express = require('express')
const { getTopics, getArticleById, addArticleVotes } = require('./controllers/controllers.js')
const { handleCustomErrors, handlePsqlErrors, handleServerErrors, pathNotFound } = require('./errors/index.js')

const app = express()
app.use(express.json())

// app.all('/api', (req, res) => {
//     res.status(200).send( { msg: "OK" } )
// })

app.get('/api/topics', getTopics)
app.get('/api/articles/:article_id', getArticleById)
app.patch('/api/articles/:article_id', addArticleVotes)


app.all('/*', pathNotFound)


app.use(handlePsqlErrors)
app.use(handleCustomErrors)
app.use(handleServerErrors)

module.exports = app