const db = require("../db/connection");

exports.selectArticleById = (articleId) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.comment_id) AS comment_count
    FROM articles 
    LEFT JOIN comments
    ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id
    ;`,
      [articleId]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateArticleVotes = (votesToAdd, articleId) => {
  return db
    .query(
      `UPDATE articles 
        SET votes = votes + $1 
        WHERE article_id = $2 
        RETURNING *;`,
      [votesToAdd, articleId]
    )
    .then(({ rows }) => {
      // if (rows.length === 0) {
      //   return Promise.reject({
      //     status: 404,
      //     msg: "ARTICLE REQUESTED NOT FOUND",
      //   });
      // }
      return rows[0];
    });
};

exports.selectArticles = () => {
  return db
    .query(
      `
  SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, COUNT(comments.comment_id) AS comment_count
  FROM articles 
  LEFT JOIN comments
  ON comments.article_id = articles.article_id
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC;`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.selectCommentsByArticleId = (articleId) => {
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1`, [articleId])
    .then(({ rows }) => {
      return rows;
    });
};

exports.addCommentByArticleId = (articleId, username, body) => {
  return db.query(
    `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING*;`,
    [username, body, articleId]).then(({ rows }) => {
      return rows[0];
    })
  }
