const e = require("express");
const {
  selectArticleById,
  updateArticleVotes,
  selectArticles,
  selectCommentsByArticleId,
  addCommentByArticleId,
} = require("../models/articles-models.js");
const { checkExists } = require("../models/models-utils.js");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.addArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  Promise.all([
    updateArticleVotes(inc_votes, article_id),
    checkExists("articles", "article_id", article_id),
  ])
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  selectArticles(sort_by, order, topic)
    // Promise.all([selectArticles(sort_by, order, topic), checkExists('topics', 'slug', topic)])
    .then((articles) => {
      console.log(articles);
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([
    selectCommentsByArticleId(article_id),
    checkExists("articles", "article_id", article_id),
  ])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  addCommentByArticleId(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
