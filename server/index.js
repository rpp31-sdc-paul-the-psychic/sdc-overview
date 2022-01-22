const express = require('express')
const app = express()
const port = 3000;
const path = require('path');
const db = require('../database/index.js');
// // const axios = require('axios');
const Redis = require('redis');

// // app.use(express.static(__dirname + '/../client/dist'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const redisClient = Redis.createClient(6379, '3.95.182.161', {no_ready_check: true});
const redisClient = Redis.createClient(6379, '3.95.182.161');
// const redisClient = Redis.createClient(); //connects to local redis
// console.log(redisClient.json);
const DEFAULT_EXPIRATION = 3600;  //one hour expiration

// await client.connect()

redisClient.on('connect', function() {
  console.log('Connected to Redis.');
});

// redisClient.set("products", 'test');

// app.use('/static', express.static(path.join(__dirname, 'public'))
app.get('/loaderio-0a45111fdd132747ca8de7e09ddd7b5e.txt', (req, res) => {
  // express.static(path.join(__dirname, 'loader')))
  res.sendFile(path.join(__dirname, '../loader/loaderio-0a45111fdd132747ca8de7e09ddd7b5e.txt'));
})

app.get('/', (req, res) => {
  res.send('Connected')
})

//GET /products/:product_id
app.get('/products/', (req, res) => {
  // console.log(req.query);
  const page = req.query.page || 1;
  const count = req.query.count || 5;
  // console.log(page);
  // console.log(count);

  redisClient.get(`products?page=${page}`, (error, products) => {
    if (error) {
      console.error(error);
    }
    if (products !== null) {
      // return res.status(200).send(reformattedResults);
      // console.log('cache hit');
      res.status(200).send(JSON.parse(products));
    } else {
      // console.log('cache miss');
      let reformattedResults = [];

      //try not returning all results instead of reformatting to drop the features
      db.getProducts(page, count)
        .then((result) => {
          for (let singleProduct of result) {
            let reformattedResult = {
              id: singleProduct.id,
              name: singleProduct.name,
              slogan: singleProduct.slogan,
              description: singleProduct.description,
              category: singleProduct.category,
              default_price: parseFloat(singleProduct.default_price).toFixed(2)
            }

            reformattedResults.push(reformattedResult);
            // singleProduct.default_price = parseFloat(singleProduct.default_price).toFixed(2);
          }
          redisClient.setex(`products?page=${page}`, DEFAULT_EXPIRATION, JSON.stringify(reformattedResults));

          //return the transformed response
          res.status(200).send(reformattedResults);
          // return response;
        })
        .catch((err) => {
          // console.log(err);
          res.status(500).send(err).end();
        })
    }
  })
})

//GET /products/:product_id
app.get('/products/:product_id', (req, res) => {
  let prod_id = req.params.product_id;
  // let prod_id = 59557;
  // console.log(prod_id);

  redisClient.get(`product:${prod_id}`, (error, product) => {
    if (error) {
      console.error(error);
    }
    if (product !== null) {
      // return res.status(200).send(reformattedResults);
      // console.log('cache hit');
      res.status(200).send(JSON.parse(product));
    } else {
      // console.log('cache miss');

      db.getProductData(prod_id)
        .then((result) => {
          // console.log('success');
          // console.log(result);
          //transform response to match formatting
          result.default_price = parseFloat(result.default_price).toFixed(2);

          redisClient.setex(`product:${prod_id}`, DEFAULT_EXPIRATION, JSON.stringify(result));
          //return the transformed response
          res.status(200).send(result);
          // return response;
        })
        .catch((err) => {
          res.status(500).send(err).end();
        })
    }
  })
})

// GET /products/:product_id/styles
app.get('/products/:product_id/styles', (req, res) => {
  let prod_id = req.params.product_id;

  // console.log('getting styles for ', prod_id);
  redisClient.get(`product:${prod_id}/styles`, (error, styles) => {
    if (error) {
      console.error(error);
    }
    if (styles !== null) {
      // return res.status(200).send(reformattedResults);
      // console.log('cache hit');
      res.status(200).send(JSON.parse(styles));
    } else {
      // console.log('cache miss');

      db.getStylesData(prod_id)
        .then((result) => {
          let reformattedResult = {
            product_id: prod_id.toString(),
            results: []
          };

          for (var singleStyle of result) {
            let reformattedSKUs = {};

            for (var singleSKU of singleStyle.skus) {
              reformattedSKUs[singleSKU.id] = {
                quantity: singleSKU.quantity,
                size: singleSKU.size.toString()
              }
            }

            let reformattedStyle = {
              style_id: singleStyle.id,
              name: singleStyle.name,
              original_price: parseFloat(singleStyle.original_price).toFixed(2),
              sale_price: (singleStyle.sale_price !== "null") ? parseFloat(singleStyle.sale_price).toFixed(2) : null,
              "default?": (singleStyle.default_style === 1) ? true : false,
              photos: singleStyle.photos,
              skus: reformattedSKUs
            }

            reformattedResult.results.push(reformattedStyle);
          }
          // console.log('reformattedResult', reformattedResult);
          redisClient.setex(`product:${prod_id}/styles`, DEFAULT_EXPIRATION, JSON.stringify(reformattedResult));

          res.status(200).send(reformattedResult);
        })
        .catch((err) => {
          res.status(500).send(err).end();
        })
    }
  })
})

//future refactor - implement helper function below
// function getOrSetCache(key, cb) {
//   return new Promise((resolve, reject) => {
//     rediscClient.get(key, async (error, data) => {
//       if (error) {
//         return reject(error);
//       }
//       if (data !== null) {
//         return resolve(JSON.parse(data));
//       }
//       const freshData = await cb();
//       redisClient.setex(key, DEFAULT_EXPIRATION, JSON.stringify(freshData));
//       resolve(freshData);
//     })
//   })
// }

//moved to server.js for jest testing
// app.listen(port, () => {
//   return console.log(`Listening on port ${port}`)
// });

module.exports = app;
