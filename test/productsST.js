import http from 'k6/http';
import { check } from 'k6';
// const app = require('../server/index.js');
// const db = require('../database/index.js');

export const options = {
  // vus: 1,
  // duration: '120s',

  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 1000,
      timeUnit: '1s',
      duration: '2m',
      preAllocatedVUs: 100,
      maxVUs: 250,
    },
  },
};

// const min = Math.ceil(170000);
// const max = Math.floor(185000);
// const page = Math.floor(Math.random() * (max - min) + min);

// const BASE_URL = `http://localhost:3000/products?page=${page}`;

export default function () {
  const min = Math.ceil(170000);
  const max = Math.floor(185000);
  const page = Math.floor(Math.random() * (max - min) + min);

  const BASE_URL = `http://localhost:3000/products?page=${page}`;
  // http.get(BASE_URL);

  const response = http.get(BASE_URL);

  check(response, {
    "is status 200": (r) => r.status === 200
  })

  // const res = http.get(BASE_URL);
  // console.log('Response time was ' + String(res.timings.duration) + ' ms');
}