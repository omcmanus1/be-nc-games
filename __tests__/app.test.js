const db = require("../db/connection");
const app = require("../app");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const {
  categoryData,
  commentData,
  reviewData,
  userData,
} = require("../db/data/test-data");

beforeEach(() => seed({ categoryData, commentData, reviewData, userData }));
afterAll(() => db.end());

describe("/api/categories", () => {
  test("GET: should respond with a 200 status code, and expected array data", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        expect(categories).toBeInstanceOf(Array);
        expect(categories.length).toBe(categoryData.length);
        categories.forEach((category) => {
          expect(category).toHaveProperty("slug");
          expect(category).toHaveProperty("description");
        });
      });
  });
  test("GET: should respond with a 404 error if incorrect endpoint is specified", () => {
    return request(app)
      .get("/api/categorieeeees")
      .expect(404)
      .then((response) => console.log(response.body));
  });
});

describe("/api/reviews/:id", () => {
  test("GET: should respond with an array containing correct single review object", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review).toBeInstanceOf(Array);
        expect(review.length).toBe(1);
        const reviewTemplate = {
          review_id: expect.any(Number),
          title: expect.any(String),
          review_body: expect.any(String),
          designer: expect.any(String),
          review_img_url: expect.any(String),
          votes: expect.any(Number),
          category: expect.any(String),
          owner: expect.any(String),
          created_at: expect.any(String),
        };
        expect(review[0]).toMatchObject(reviewTemplate);
        expect(review[0].review_id).toBe(2);
      });
  });
  test("GET: should respond with 404 if qeuried with invalid ID", () => {
    return request(app)
      .get("/api/reviews/56777")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not Found");
      });
  });
});
