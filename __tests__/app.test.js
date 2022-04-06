const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

// ------ topics ------
describe("GET /api/topics", () => {
  test("status: 200 should respond with array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              description: expect.any(String),
              slug: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /topicsz", () => {
  test("status: 404 responds with a not found message", () => {
    return request(app)
      .get("/topicsz")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("PATH REQUESTED NOT FOUND");
      });
  });
});

// ------ articles ------
describe("GET /api/articles/article_id", () => {
  test("status: 200 should respond with article object with required properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
          })
        );
      });
  });
});
// --- PATCH articles ---
describe("PATCH /api/articles/:article_id", () => {
  test("status: 200 responds with article object featuring added votes", () => {
    return request(app)
      .patch("/api/articles/7")
      .send({ inc_votes: 50 })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 7,
            title: "Z",
            topic: "mitch",
            author: "icellusedkars",
            body: "I was hungry.",
            created_at: "2020-01-07T14:08:00.000Z",
            votes: 50,
          })
        );
      });
  });
  test("status: 200 responds with article object featuring decremented votes", () => {
    return request(app)
      .patch("/api/articles/7")
      .send({ inc_votes: -50 })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 7,
            title: "Z",
            topic: "mitch",
            author: "icellusedkars",
            body: "I was hungry.",
            created_at: "2020-01-07T14:08:00.000Z",
            votes: -50,
          })
        );
      });
  });

  test("status: 400 responds with message when invalid id is given", () => {
    return request(app)
      .patch("/api/articles/ncnews")
      .send({ inc_votes: 50 })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid input");
      });
  });
  test("status: 400 responds with message when given something other than number for inc_votes", () => {
    return request(app)
      .patch("/api/articles/7")
      .send({ inc_votes: "ncnews" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid input");
      });
  });
  test("status: 400 responds with message when no inc_votes key is included on request body", () => {
    return request(app)
      .patch("/api/articles/7")
      .send({ no_votes: 50 })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid input");
      });
  });
  test("status: 404 responds with message when article given does not exist, but id type is valid", () => {
    return request(app)
      .patch("/api/articles/99999999")
      .send({ inc_votes: 50 })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Resource not found");
      });
  });
});

// --- GET all usernames ---

describe("GET /api/users", () => {
  test("status: 200 should respond with array of username objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toHaveLength(4);
        expect(users).toBeInstanceOf(Object);
        expect(users).toEqual(
          expect.objectContaining([
            { username: "butter_bridge" },
            { username: "icellusedkars" },
            { username: "rogersop" },
            { username: "lurker" },
          ])
        );
      });
  });
});
// --- GET articles with selected props ---
describe("GET /api/articles", () => {
  test("status: 200 should respond with array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(12);
        expect(articles[0]).toBeInstanceOf(Object);
        articles.forEach((article) => {
          // expect(article).toBeInstanceOf(Object);
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
      });
  });
  test("status: 200 responds with an array of articles, sorted by date as default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("status: 200 each article object in array responds with comment_count property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              body: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
              // if get problems change commentcount back to String expected
            })
          );
        });
      });
  });
  test("status: 200 sort by query should sort articles by valid column", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("votes", { descending: true });
      });
  });
  test("Status 200, should permit ordering by ascending and descending", () => {
    return request(app)
      .get("/api/articles?order=ASC")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at");
      });
  });
  test("status: 200 order query should sort articles by ascending/descending", () => {
    return request(app)
      .get("/api/articles?order=ASC")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSorted({ ascending: true });
      });
  });
  test("status: 200 order query should sort articles by ascending/descending, defaults to descending", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSorted({ descending: true });
      });
  });
  test("status: 200 topic query should filter articles by topic specified", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body: { articles } }) => {
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              title: expect.any(String),
              topic: "cats",
            })
          );
        });
      });
  });
  test("status: 400 responds with message when invalid column is used in sort by query", () => {
    return request(app)
      .get("/api/articles?sort_by=invalid_column")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid sort query");
      });
  });
  test("status: 400 responds with message when invalid order is given in order by query", () => {
    return request(app)
      .get("/api/articles?order=invalid_order")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid order query");
      });
  });
  test("status: 404 responds with message when given a topic that does not exist", () => {
    return request(app)
      .get("/api/articles?topic=cheese")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Topic not found");
      });
  });
});

// ------ comment_count ------
describe("/api/articles/:article_id", () => {
  describe("GET", () => {
    test("status: 200 responds with a comment count property", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: 1,
              title: "Living in the shadow of a great man",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 100,
              comment_count: "11",
            })
          );
        });
    });
  });
});

describe("/api/articles/:article_id/comments", () => {
  describe("GET", () => {
    test("status: 200 responds with array of comments, each of which has required properties", () => {
      return request(app)
        .get("/api/articles/9/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toHaveLength(2);
          comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
              })
            );
          });
        });
    });
    test("status: 200 responds with object containing empty array when article has no comments", () => {
      return request(app)
        .get("/api/articles/4/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toEqual([]);
        });
    });
  });
  test("status: 400 responds with message when given invalid article id", () => {
    return request(app)
      .get("/api/articles/ncnews/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid input");
      });
  });
  test("status: 404 responds with message when given an article id that is a valid type but article does not exist", () => {
    return request(app)
      .get("/api/articles/99999999/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Resource not found");
      });
  });
});

// query articles ---

describe("/api/articles/:article_id/comments", () => {
  describe("POST", () => {
    test("status: 201 returns object with the input username and body", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "butter_bridge",
          body: "I'm like a bird, I meow and then fly away",
        })
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              comment_id: expect.any(Number),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
    });
    test("status: 400 responds if user does not include comment in comment post", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "butter_bridge",
        })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid input");
        });
    });
    test("status: 400 responds with message when given invalid article id", () => {
      return request(app)
        .post("/api/articles/ncnews/comments")
        .send({
          username: "butter_bridge",
          body: "I'm like a bird, I meow and then fly away",
        })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid input");
        });
    });
  });
  test("status: 404 when article does not exist", () => {
    return request(app)
      .post("/api/articles/999999/comments")
      .send({
        username: "butter_bridge",
        body: "I'm like a bird, I meow and then fly away",
      })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("PATH REQUESTED NOT FOUND");
      });
  });
});

describe("/api/comments/:comment_id", () => {
  describe("DELETE", () => {
    test("status: 204 should delete comment by comment id with no response", () => {
      return request(app).delete("/api/comments/1").expect(204);
    });
    test("status: 400 should respond with message when given an invalid comment id", () => {
      return request(app)
        .delete("/api/comments/qwerty")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid input");
        });
    });
    test("status: 404 should respond with message when comment is not found", () => {
      return request(app)
        .delete("/api/comments/999999")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("comment not found");
        });
    });
  });
});
