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
  test("404: Server responds with a 404 for any incorrect route", async () => {
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

describe("GET /api/articles", () => {
  test("200: Server responds with all articles and the appropriate object keys", async () => {
    const {
      body: { articles },
    } = await request(app).get("/api/articles").expect(200);
    expect(articles.length).toBeGreaterThan(1);
    articles.forEach((article) => {
      expect(article).toEqual(
        expect.objectContaining({
          article_id: expect.any(Number),
          author: expect.any(String),
          title: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number),
        })
      );
      expect(article).not.toHaveProperty("body");
    });
  });
  test("200:Server responds with article objects in descending date order", async () => {
    const {
      body: { articles },
    } = await request(app).get("/api/articles").expect(200);
    expect(articles).toBeSortedBy("created_at", {
      descending: true,
    });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Server responds with an array of comment objects with the correct keys", async () => {
    const {
      body: { comments },
    } = await request(app).get("/api/articles/1/comments").expect(200);

    expect(comments.length).toBeGreaterThan(1);
    comments.forEach((comment) => {
      expect(comment).toEqual(
        expect.objectContaining({
          article_id: 1,
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
        })
      );
    });
  });
  test("200: Server responds with an array of comments in order of newest first", async () => {
    const {
      body: { comments },
    } = await request(app).get("/api/articles/1/comments").expect(200);
    expect(comments).toBeSortedBy("created_at", { descending: true });
  });
  test("200: Server responds with an empty array when given a valid article_id in the database with no comments", async () => {
    const {
      body: { comments },
    } = await request(app).get("/api/articles/2/comments").expect(200);
    expect(comments).toEqual([]);
  });
  test("404: Server responds with a 404 for a valid article_id that does not exist in the database", async () => {
    const {
      body: { msg },
    } = await request(app).get("/api/articles/999/comments").expect(404);
    expect(msg).toBe("Resource not found");
  });
  test("400: Server responds with a 400 for an invalid article id", async () => {
    const {
      body: { msg },
    } = await request(app).get("/api/articles/comments/comments").expect(400);
    expect(msg).toBe("Invalid input");
  });
});

describe("POST /api/articles:article_id/comments", () => {
  test("201: Server responds with the newly posted comment", async () => {
    const {
      body: { comment },
    } = await request(app)
      .post("/api/articles/2/comments")
      .send({ username: "lurker", body: "Fake news" })
      .expect(201);

    expect(comment).toEqual(
      expect.objectContaining({
        comment_id: expect.any(Number),
        article_id: 2,
        author: "lurker",
        body: "Fake news",
        votes: 0,
        created_at: expect.any(String),
      })
    );
  });
  test("404: Server responds with a 404 when posting to a valid id that has no article", async () => {
    const {
      body: { msg },
    } = await request(app)
      .post("/api/articles/999/comments")
      .send({ username: "lurker", body: "Fake news" })
      .expect(404);

    expect(msg).toBe("Resource not found");
  });
  test("400: Server responds with a 400 when posting to an invalid article id", async () => {
    const {
      body: { msg },
    } = await request(app)
      .post("/api/articles/mystery/comments")
      .send({ username: "lurker", body: "Fake news" })
      .expect(400);

    expect(msg).toBe("Invalid input");
  });
  test("400: Server responds with a 400 when passed an empty comment object", async () => {
    const {
      body: { msg },
    } = await request(app)
      .post("/api/articles/2/comments")
      .send({})
      .expect(400);

    expect(msg).toBe("Invalid input");
  });
  test("404: Server responds with a 404 when passed a user that does not exist", async () => {
    const {
      body: { msg },
    } = await request(app)
      .post("/api/articles/2/comments")
      .send({ username: "verity", body: "Fake news" })
      .expect(404);

    expect(msg).toBe("Resource not found");
  });
  test("201: Server ignores extra keys on comment", async () => {
    const {
      body: { comment },
    } = await request(app)
      .post("/api/articles/1/comments")
      .send({ username: "lurker", body: "fake news", extraKey: "not needed" })
      .expect(201);

    expect(comment).not.toHaveProperty("extraKey");
  });
});
