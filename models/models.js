const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then((result) => result.rows);
};

exports.selectArticleById = (articleId) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [articleId])
    .then(({ rows }) => {
      // if (rows.length === 0) {
      //   return Promise.reject({
      //     status: 404,
      //     msg: "PATH REQUESTED NOT FOUND",
      //   });
      // }
      return rows[0];
    });
};

exports.updateVotes = (articleId, votes) => {
  const queryValues = []
  let queryStr = 'INSERT INTO articles SET inc_votes= inc_votes + $2 WHERE article_id=$1;'
  

}