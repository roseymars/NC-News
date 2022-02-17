const db = require("../db/connection");

exports.selectArticleById = (articleId) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [articleId])
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
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "ARTICLE REQUESTED NOT FOUND",
        });
      }
      return rows[0];
    });
};

// the articles should be sorted by date in descending order.
exports.selectArticles = () => {
  return db
    .query(
      `SELECT article_id, title, topic, author, created_at, votes FROM articles ORDER BY created_at DESC;`
    )
    .then(({ rows }) => {
      return rows;
    });
};
