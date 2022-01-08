import http from 'k6/http';
import { sleep } from 'k6';
// const app = require('../server/index.js');
// const db = require('../database/index.js');

export const options = {
  vus: 1,
  duration: '180s',
};

// const min = Math.ceil(900000);
// const max = Math.floor(1000000);
// const id = Math.floor(Math.random() * (max - min) + min);

// const BASE_URL = `http://localhost:3000/products/${id}/styles`;

export default function () {
  const min = Math.ceil(900000);
  const max = Math.floor(1000000);
  const id = Math.floor(Math.random() * (max - min) + min);

  const BASE_URL = `http://localhost:3000/products/${id}/styles`;
  http.get(BASE_URL);

  // const res = http.get(BASE_URL);
  // console.log('Response time was ' + String(res.timings.duration) + ' ms');
}