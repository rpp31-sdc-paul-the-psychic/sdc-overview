const request = require("supertest");
const app = require('../server/index.js');
const db = require('../database/index.js');

const sum = require('../sum.js')

test('adds 1 + 1 to equal 2', () => {
  expect(sum(1, 1)).toBe(2);
});

describe('GET /products/:product_id', () => {
  test('should respond with a 200 status code', async () => {
    const response = await request(app).get("/products/59557");
    expect(response.statusCode).toBe(200);
  });

  test("should specify json in the content type header", async () => {
    const response = await request(app).get("/products/59557");
    expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
  })

  test("response has user id", async () => {
    const response = await request(app).get("/products/59557");
    expect(response.body.id).toBeDefined()
  })

  test("response has user id which matches id requested", async () => {
    const response = await request(app).get("/products/59557");
    expect(response.body.id).toEqual(59557);
  })
});

describe('GET /products/:product_id/styles', () => {
  test('should respond with a 200 status code', async () => {
    const response = await request(app).get("/products/59557/styles");
    expect(response.statusCode).toBe(200);
  });

  test("should specify json in the content type header", async () => {
    const response = await request(app).get("/products/59557/styles");
    expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
  })

  test("response has user id which matches id requested", async () => {
    const response = await request(app).get("/products/59557");
    expect(response.body.id).toEqual(59557);
  })
});

describe('GET /products/', () => {
  test('should respond with a 200 status code', async () => {
    const response = await request(app).get("/products/");
    expect(response.statusCode).toBe(200);
  });

  test("should specify json in the content type header", async () => {
    const response = await request(app).get("/products/");
    expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
  })
});