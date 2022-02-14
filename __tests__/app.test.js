const request = require('supertest')
const app = require('../app')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index.js')

beforeEach(() => seed(testData))
afterAll(() => db.end())


describe('GET /api/topics', () => {
    test('200: should respond with array of topics', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(( {body: { topics } } ) => {
            console.log(topics)
            expect(topics).toHaveLength(3)
            topics.forEach((topic) => {
                expect(topic).toEqual(
                    expect.objectContaining({
                        description: expect.any(String),
                        slug: expect.any(String)
                    })
                )
            })
        })
    })
});

describe("GET /topicsz", () => {
    test("404: responds with a not found message", () => {
      return request(app)
        .get("/topicsz")
        .expect(404)
        .then(response => {
          expect(response.body.msg).toBe("NOT FOUND");
        });
    });
  });