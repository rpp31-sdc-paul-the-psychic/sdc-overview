const express = require('express')
const app = express()
const port = 3000;
const path = require('path');
const db = require('../database/index.js');
// // const axios = require('axios');

// // app.use(express.static(__dirname + '/../client/dist'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.send('Hello world')
})


//GET /products/:product_id
app.get('/products/', (req, res) => {

  console.log(req.query);

  const page = req.query.page || 1;
  const count = req.query.count || 5;

  console.log(page);
  console.log(count);

  console.log('pinging get products');

  let reformattedResults = [];

  //try not returning all results instead of reformatting to drop the features
  db.getProducts(page, count)
   .then((result) => {
    console.log('success');

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
    //transform response to match formatting
    console.log(reformattedResults);

    //return the transformed response
    res.status(200).send(reformattedResults);
    // return response;
  })
    .catch((err) => {
      res.status(500).send(err).end();
    })
})

//GET /products/:product_id
app.get('/products/:product_id', (req, res) => {
  let prod_id = req.params.product_id;
  // let prod_id = 59557;
  console.log(prod_id);

  db.getProductData(prod_id)
   .then((result) => {
    console.log('success');
    // console.log(result);
    //transform response to match formatting
    result.default_price = parseFloat(result.default_price).toFixed(2);

    //return the transformed response
    res.status(200).send(result);
    // return response;
  })
    .catch((err) => {
      res.status(500).send(err).end();
    })
  // res.send('Getting product information')
})

// GET /products/:product_id/styles
app.get('/products/:product_id/styles', (req, res) => {
  let prod_id = req.params.product_id;

  console.log('getting styles for ', prod_id);

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
      console.log('reformattedResult', reformattedResult);

      res.status(200).send(reformattedResult);
    })
    .catch((err) => {
      res.status(500).send(err).end();
    })
})

//moved to server.js for jest testing
// app.listen(port, () => {
//   return console.log(`Listening on port ${port}`)
// });

module.exports = app;
