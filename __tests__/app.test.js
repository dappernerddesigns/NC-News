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
  });
});

describe("GET /articles/:article", () => {
  test("200: Server responds with an article object", async () => {
    const articleResponse = await request(app).get("/api/articles/1");
    const { article } = articleResponse.body;

    expect(article[0]).toEqual(
      expect.objectContaining({
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: expect.any(String),
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      })
    );
  });
});
