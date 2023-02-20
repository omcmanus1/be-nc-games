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
    return request(app).get("/api/categorieeeees").expect(404);
  });
});

describe.skip("/api/reviews/:review_id", () => {
  test("GET: should respond with a 200 status code and expected single review", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
      });
  });
});
