import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  http.get('https://test.k6.io');
  sleep(1);


  //for time on an individual request - comment out lines 4-7 and 10-11
  // const res = http.get('http://httpbin.org');
  // console.log('Response time was ' + String(res.timings.duration) + ' ms');
}