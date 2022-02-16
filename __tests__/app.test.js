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
  test("status: 400 responds when given article is not a valid one", () => {
    return request(app)
      .get("/api/articles/notAnId")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid input");
      });
  });
});

// --- PATCH articles ---
describe("PATCH /api/articles/:article_id", () => {
  test("status: 201 responds with article object featuring added votes", () => {
    return request(app)
      .patch("/api/articles/7")
      .send({ inc_votes: 50 })
      .expect(201)
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
  test("status: 201 responds with article object featuring decremented votes", () => {
    return request(app)
      .patch("/api/articles/7")
      .send({ inc_votes: -50 })
      .expect(201)
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
      .send({ inc_votes: 'ncnews' })
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
        expect(msg).toBe("PATH REQUESTED NOT FOUND");
      });
  });
  
});
