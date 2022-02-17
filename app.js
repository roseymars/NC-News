const express = require('express')
const { getTopics } = require('./controllers/topics-controllers.js')
const { getUsers } = require('./controllers/users-controllers.js')
const { getArticleById, addArticleVotes } = require('./controllers/articles-controllers.js')
const { handleCustomErrors, handlePsqlErrors, handleServerErrors, pathNotFound } = require('./errors/index.js')

const app = express()
app.use(express.json())

// app.all('/api', (req, res) => {
//     res.status(200).send( { msg: "OK" } )
// })

app.get('/api/topics', getTopics)
app.get('/api/articles/:article_id', getArticleById)
app.get("/api/users", getUsers)
app.patch('/api/articles/:article_id', addArticleVotes)


app.all('/*', pathNotFound)


app.use(handlePsqlErrors)
app.use(handleCustomErrors)
app.use(handleServerErrors)

module.exports = app