//DUPLICATE FROM DATABASE FOLDER?? DELETE IF UNNECESSARY

const fs = require('fs');
// const { parse } = require('csv-parse');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/sdc',
  { useNewUrlParser: true, useUnifiedTopology: true });

let productSchema = mongoose.Schema({
  "id": Number,
  "name": String,
  "slogan": String,
  "description": String,
  "category": String,
  "default_price": String,
  "features": [
    {
      "feature": String,
      "value": String
    }
  ]
  //"created_at:": - if not using, why take up extra space/time?
  //"updated_at":
  // "related_products": [
  //   Number,
  //   Number
  // ]
});

let styleSchema = mongoose.Schema({
  "productId": Number, //changed from a string and this fixed the empty array
  "id": Number, //this will become style_id in the server
  "name": String,
  "original_price": String,
  "sale_price": String,
  "default_style": Number, //this will become a boolean in the server
  "photos": Array,
  "skus": Array
})

let Product = mongoose.model('Products', productSchema);
let Style = mongoose.model('Style', styleSchema, 'style');

let getProductData = function(product_id) {
  console.log('getting data for ', product_id);

  return Product.findOne({id: product_id});
}


let getStylesData = function(product_id) {
  console.log('getting style data for ', product_id);

  let test = Style.find({productId: product_id});
  return Style.find({productId: product_id});
}

module.exports.getProductData = getProductData;
module.exports.getStylesData = getStylesData;

//use aggregate pipeline
//group features by id
//add to product

//OR
//for each document in features
//combine

// match: {},

//lookup first
// db.products.aggregate(
//   {
//     $lookup:
//     {
//       from: "features",
//       localField: "id",
//       foreignField: "id",
//       as: "features"
//     }
//   }
// )

// db.products.aggregate(
//   {
//     $addFields: {
//       features:
//         db.features.aggregate(
//           [
//             {
//               $group:
//               {
//                 _id: "$product_id",
//                 "features": {
//                   $push: {
//                     feature: "$feature",
//                     value: "$value"
//                   }
//                 }
//               }
//             }
//           ], { "allowDiskUse": true }).features
//     }
//   }
// )

// //Create a new collection with features in the format we want - worked, but unnecessary - use lookup instead
// db.features.aggregate(
//   [
//     {$group:
//       {
//       _id: "$product_id",
//        "features": {
//          $push:{
//          feature: "$feature",
//           value: "$value"
//         }
//         }
//       }
//     },
//     {
//       $out: { db: "sdc", coll: "featurelist" }
//     }
// ], { "allowDiskUse" : true })

//STEP 1 OF TRANSFORMATION
//CREATE PRODUCTS DB WITH COMBINED DATA
// db.product.aggregate([
//   {
//     $lookup:
//     {
//       from: "features",
//       localField: "id",
//       foreignField: "product_id",
//       as: "features"
//     }
//   },
//   {
//     "$project": {
//       "features._id": 0,
//       "features.id": 0,
//       "features.product_id": 0
//     }
//   },
//   {
//     $out: "products"
//   }
// ])

//STEP 2 OF TRANSFORMATION
//CREATE NEW DB WITH STYLES AND PHOTOS
// db.styles.aggregate([
//   {
//     $lookup:
//     {
//       from: "photos",
//       localField: "id",
//       foreignField: "styleId",
//       as: "photos"
//     }
//   },
//   {
//     "$project": {
//       "photos._id": 0,
//       "photos.id": 0,
//       "photos.styleId": 0
//     }
//   },
//   {
//     $out: "stylelist"
//   }
// ])

//STEP 3 OF TRANSFORMATION
//CREATE NEW DB WITH STYLES/PHOTOS, AND SKUS - ~11.5 min - would indexing stylelist's id improve performance? - no
//INDEX PRODUCTID AFTERWARDS - this improves the app.get('/products/:product_id/styles') fn from 2.8s to 30ms
// db.stylelist.aggregate([
//   {
//     $lookup:
//     {
//       from: "skus",
//       localField: "id",
//       foreignField: "styleId",
//       as: "skus"
//     }
//   },
//   {
//     "$project": {
//       "skus._id": 0,
//       "skus.styleId": 0
//     }
//   },
//   {
//     $out: "style"
//   }
// ])



// db.product.aggregate([
//   {
//     $lookup:
//       {
//         from: "features",
//         localField: "id",
//         foreignField: "product_id",
//         as: "features"
//       }
//   },
//   {
//     "$project": {
//       "features._id": 0,
//       "features.id": 0,
//       "features.product_id": 0
//     }
//   },
//   {
//     $out: "products"
//   }
// ])