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

exports.selectArticles = (sort_by = "created_at", order = "DESC", topic) => {
  const validSortBys = [
    "comment_count",
    "author",
    "title",
    "topic",
    "created_at",
    "votes",
  ];

  const validOrderBys = ["ASC", "DESC"];

  if (!validSortBys.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort query" });
  }

  if (!validOrderBys.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  let queryStr = `
  SELECT articles.*, CAST(COUNT(comments.comment_id) AS INT) AS comment_count
  FROM articles 
  LEFT JOIN comments
  ON comments.article_id = articles.article_id`;

  let queryValues = [];

  if (topic) {
    queryValues.push(topic);
    queryStr += ` WHERE articles.topic = $1`;
  }
  queryStr += ` GROUP BY articles.article_id ORDER BY articles.${sort_by} ${order};`;

  return db.query(queryStr, queryValues).then(({ rows }) => {
    if (rows.length === 0)
      return Promise.reject({ status: 404, msg: "Topic not found" });
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
  return db
    .query(
      `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING*;`,
      [username, body, articleId]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.eraseCommentByCommentId = (commentId) => {
  return db
    .query(
      `
  DELETE FROM comments
  WHERE comment_id = $1
  RETURNING*;
`,
      [commentId]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "comment not found" });
      } else {
        return rows;
      }
    });
};
