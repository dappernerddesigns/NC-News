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
    const {
      body: { msg },
    } = await request(app).get("/api/").expect(200);

    expect(msg).toBe("Server Running ok");
  });
});

describe("GET /topics/", () => {
  test("200: Server responds with an array of topic objects", async () => {
    const {
      body: { topics },
    } = await request(app).get("/api/topics").expect(200);
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
    const error = await request(app).get("/api/not-a-route").expect(404);
  });
});

describe("GET /articles/:article", () => {
  test("200: Server responds with an article object", async () => {
    const {
      body: { article },
    } = await request(app).get("/api/articles/1").expect(200);

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
  test("404: Server responds with a 404 when given a valid article_id but no matching article in db", async () => {
    const {
      body: { msg },
    } = await request(app).get("/api/articles/999").expect(404);
    expect(msg).toBe("Article not found");
  });
  test("400: Server responds with a 400 when passed an article_id that is not a number", async () => {
    const {
      body: { msg },
    } = await request(app).get("/api/articles/bananas").expect(400);
    expect(msg).toBe("Invalid input");
  });
});
