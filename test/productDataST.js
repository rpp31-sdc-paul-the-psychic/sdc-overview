import http from 'k6/http';
import { sleep } from 'k6';
// const app = require('../server/index.js');
// const db = require('../database/index.js');

// export const options = {
//   vus: 10,
//   duration: '30s',
// };

const min = Math.ceil(900000);
const max = Math.floor(1000000);
const id = Math.floor(Math.random() * (max - min) + min);

const BASE_URL = `http://localhost:3000/products/${id}`;

export default function () {
  // http.get('https://test.k6.io');
  // sleep(1);

  //test a range of ids - Math.random for last 10% of ids


  //for time on an individual request - comment out lines 4-7 and 10-11
  const res = http.get(BASE_URL);
  console.log('Response time was ' + String(res.timings.duration) + ' ms');
}