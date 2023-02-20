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
  test("GET: should respond with a 200 status code", () => {
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
        // test("GET: should respond with an array", () => {
        //   const { categories } = body;
        //   expect(categories).toBeInstanceOf(Array);
        // });
        // test("GET: should respond with an array of the correct length", () => {
        //   const { categories } = body;
        //   expect(categories.length).toBe(categoryData.length);
        // });
        // test("GET: should respond with an array of category objects with the correct keys", () => {
        //   return request(app)
        //     .get("/api/categories")
        //     .then(({ body }) => {
        //       const { categories } = body;
        //       categories.forEach((category) => {
        //         expect(category).toHaveProperty("slug");
        //         expect(category).toHaveProperty("description");
        //       });
        //     });
        // });
      });
  });
  test("GET: should respond with a 400 error if incorrect endpoint is specified", () => {
    return request(app).get("/api/categorieeeees").expect(404);
  });
});
