// import axios from 'axios';
//need to install babel for axios?
// const axios = require('axios');

// import getProductData from '../database/index.js';
// import getStylesData from '../database/index.js';
// const getProductData = require('../database/index.js');
// const getStylesData = require('../database/index.js');
const request = require("supertest");
const app = require('../server/index.js');
const db = require('../database/index.js');


const sum = require('../sum.js')

// beforeAll(done => {
//   done()
// })

// afterAll(done => {
//   // Closing the DB connection allows Jest to exit successfully.
//   mongoose.connection.close()
//   done()
// })

test('adds 1 + 1 to equal 2', () => {
  expect(sum(1, 1)).toBe(2);
});


describe('Unit tests', () => {
  test('Tests that db.getProductData is called with the correct id', async () => {
    // const spy = jest.spyOn(app, 'db.getProductData');
    const productData = jest.fn();

    const response = await request(app).get("/products/59557");
    // expect(db.getProductData).toHaveBeenCalledWith(59557);
    // expect(db.getProductData).toHaveBeenCalled();
    expect(productData).toHaveBeenCalled();
  });
});


describe('Integration tests', () => {
  test('Tests that an individual product id is returned', () => {

    expect(2).toEqual(2);
  });

  test('Tests that style data is returned for an individual product', () => {

    expect(2).toEqual(2);
  });
  // done();
});