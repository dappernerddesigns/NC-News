const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => {
  return db.end();
});

describe("Server Status", () => {
  test("200: Responds with a message that the server is running ok", async () => {
    const serverMessage = await request(app).get("/api/");
    const { msg } = serverMessage.body;
    expect(msg).toBe("Server Running ok");
  });
});

describe("GET /topics/", () => {
  test("200: Server responds with an array of topic objects", async () => {
    const topicArray = await request(app).get("/api/topics");
    const { topics } = topicArray.body;
    expect(topics.length).toBeGreaterThan(1);
    topics.forEach((topic) => {
      expect(topic).toEqual(
        expect.objectContaining({
          slug: expect.any(String),
          description: expect.any(String),
        })
      );
    });
  });
});
describe("404 Not a route", () => {
  test("Server responds with a 404 for any incorrect route", async () => {
    const error = await request(app).get("/api/not-a-route");
    expect(error.status).toBe(404);
    console.log(Object.keys(error));
  });
});
