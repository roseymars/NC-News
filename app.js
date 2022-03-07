const cors = require("cors");
const express = require("express");
const { getTopics } = require("./controllers/topics-controllers.js");
const { getUsers } = require("./controllers/users-controllers.js");
const {
  getArticleById,
  addArticleVotes,
  getArticles,
  postCommentByArticleId,
  getCommentsByArticleId,
  deleteCommentByCommentId,
} = require("./controllers/articles-controllers.js");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
  pathNotFound,
} = require("./errors/index.js");
const { getApi } = require("./controllers/api-controllers.js");

app.use(cors());
const app = express();
app.use(express.json());

app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/users", getUsers);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentByArticleId);
app.patch("/api/articles/:article_id", addArticleVotes);
app.delete("/api/comments/:comment_id", deleteCommentByCommentId);

app.all("/*", pathNotFound);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
