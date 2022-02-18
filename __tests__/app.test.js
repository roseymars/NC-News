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
  test("status: 200 should respond with array of article objects with all properties EXCEPT body", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(12);
        expect(articles[0]).toBeInstanceOf(Object);
        articles.forEach((article) => {
          expect(article).toBeInstanceOf(Object);
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
  test('status: 400 responds with message when given invalid article id', () => {
    return request(app)
        .get("/api/articles/ncnews/comments")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid input")
         
        });
  });
  test('status: 404 responds with message when given an article id that is a valid type but article does not exist', () => {
    return request(app)
        .get("/api/articles/99999999/comments")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Resource not found")
        });
  });
});
