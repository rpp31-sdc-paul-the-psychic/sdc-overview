const express = require('express')
const app = express()
const port = 3000;
const path = require('path');
const db = require('../database/index.js');
const Redis = require('redis');
// const newrelic = require('newrelic')

// // app.use(express.static(__dirname + '/../client/dist'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const redisClient = Redis.createClient(6379, '54.210.250.29');
const DEFAULT_EXPIRATION = 3600;  //one hour expiration

redisClient.on('connect', function() {
  console.log('Connected to Redis.');
});

app.get('/loaderio-61e936a5a3b3d5c01c770f3fe6db642d.txt', (req, res) => {
  res.sendFile(path.join(__dirname, '../loader/loaderio-61e936a5a3b3d5c01c770f3fe6db642d.txt'));
})

app.get('/', (req, res) => {
  res.send('Connected')
})

//GET /products/:product_id
app.get('/products/', (req, res) => {
  const page = req.query.page || 1;
  const count = req.query.count || 5;

  redisClient.get(`products?page=${page}`, (error, products) => {
    if (error) {
      console.error(error);
    }

    if (products !== null) {
      res.status(200).send(JSON.parse(products));
    } else {
      let reformattedResults = [];

      //future refactor - instead of returning all results, reformat to drop the features
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
          }
          redisClient.setex(`products?page=${page}`, DEFAULT_EXPIRATION, JSON.stringify(reformattedResults));

          res.status(200).send(reformattedResults);
        })
        .catch((err) => {
          res.status(500).send(err).end();
        })
    }
  })
})

//GET /products/:product_id
app.get('/products/:product_id', (req, res) => {
  let prod_id = req.params.product_id;

  redisClient.get(`product:${prod_id}`, (error, product) => {
    if (error) {
      console.error(error);
    }
    if (product !== null) {
      res.status(200).send(JSON.parse(product));
    } else {
      db.getProductData(prod_id)
        .then((result) => {
          //transform response to match formatting
          result.default_price = parseFloat(result.default_price).toFixed(2);

          redisClient.setex(`product:${prod_id}`, DEFAULT_EXPIRATION, JSON.stringify(result));
          //return the transformed response
          res.status(200).send(result);
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

  redisClient.get(`product:${prod_id}/styles`, (error, styles) => {
    if (error) {
      console.error(error);
    }
    if (styles !== null) {
      res.status(200).send(JSON.parse(styles));
    } else {
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
          redisClient.setex(`product:${prod_id}/styles`, DEFAULT_EXPIRATION, JSON.stringify(reformattedResult));

          res.status(200).send(reformattedResult);
        })
        .catch((err) => {
          res.status(500).send(err).end();
        })
    }
  })
})

//moved to server.js for jest testing
// app.listen(port, () => {
//   return console.log(`Listening on port ${port}`)
// });

module.exports = app;