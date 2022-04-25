const fs = require('fs');
require('dotenv').config();
// const { parse } = require('csv-parse');

const mongoose = require('mongoose');
// let URIKey = process.env.DB_URI;

//connect to local db
// mongoose.connect('mongodb://localhost/sdc',
//connect to db from local, but would have to update public IPv4 address each time - can't connect to private IP from local
mongoose.connect(process.env.DB_URI,
//connect to deployed db from production server
// mongoose.connect('mongodb://172.31.29.220:27017/sdc',
  { useNewUrlParser: true, useUnifiedTopology: true }, function(err) {
    if (err) {
      console.log(err);
    }
  });

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

let getProducts = function(page, count) {
  let first = 59553 + count * (page - 1);
  let last = first + (count - 1);

  return Product.find({id: {$gte: first, $lte: last}})
}

let getProductData = function(product_id) {
  return Product.findOne({id: product_id});
}

let getStylesData = function(product_id) {
  return Style.find({productId: product_id});
}

module.exports.getProducts = getProducts;
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

//Create indexes

//STEP 1 OF TRANSFORMATION
//CREATED PRODUCTS DB WITH COMBINED DATA

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




// console.log('test');
// const records = [];

// // Add the product data to the database
// // id,name,slogan,description,category,default_price
// fs.createReadStream("./legacy-data/product.csv")
//     .pipe(parse({delimiter: ','}))
//     .on('data', function(csvrow) {
//         // console.log('test1', csvrow); // this prints after every row is handled
//         //do something with csvrow
//       // console.log('test', typeof csvrow[0]);
//         let convertedRecord = {
//           "id": Number(csvrow[0]),
//           "name": csvrow[1],
//           "slogan": csvrow[2],
//           "description": csvrow[3],
//           "category": csvrow[4],
//           "default_price": csvrow[5]
//         }
//         records.push(convertedRecord);
//         // records.push(csvrow);
//     })
//     .on('end',function() {
//       //do something with csvData
//       console.log('test2', records); //this prints after all rows are handled
//       Product.insertMany(records, function(error, docs) {
//         if (error) {
//           console.log(error);
//         } else {
//           console.log(docs);
//         }
//       });
//     });

//read csv file line by line
//separate by comma
//insert into mongo db

// RAN OUT OF MEMORY
// FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed mongoose update - JavaScript heap out of memory
// Add the features data to the database
// id,product_id,feature,value
// fs.createReadStream("./legacy-data/features.csv")
//     .pipe(parse({delimiter: ','}))
//     .on('data', function(csvrow) {
//         console.log('test1', csvrow); // this prints after every row is handled
//         //do something with csvrow
//       // console.log('test', typeof csvrow[0]);
//         let convertedRecord = {
//           // "id": Number(csvrow[1]),
//           "feature": csvrow[2],
//           "value": csvrow[3]
//         }

//         Product.update(
//           { id: Number(csvrow[1]) },
//           { $addToSet: { features: convertedRecord } },
//           {},
//           function(error, docs) {
//             if (error) {
//               console.log(error);
//             } else {
//               console.log(docs);
//             }
//           }
//       );

//         // records.push(convertedRecord);
//         // records.push(csvrow);
//     })
//     .on('end',function() {
//       //do something with csvData
//       // console.log('test2', records); //this prints after all rows are handled
//       // Product.insertMany(records, function(error, docs) {
//       //   if (error) {
//       //     console.log(error);
//       //   } else {
//       //     console.log(docs);
//       //   }
//       // });

//       //get the current features
//       //append the new feature
//       //update the record with the current
//     });

// Add the features data to the database
// id,current_product_id,related_product_id
    // fs.createReadStream("./legacy-data/relatedsample.csv")
    // .pipe(parse({delimiter: ','}))
    // .on('data', function(csvrow) {
    //     // console.log('test1', csvrow); // this prints after every row is handled
    //     //do something with csvrow
    //   // console.log('test', typeof csvrow[0]);
    //     // let convertedRecord = {
    //     //   // "id": Number(csvrow[1]),
    //     //   "feature": csvrow[2],
    //     //   "value": csvrow[3]
    //     // }

    //     Product.update(
    //       { id: Number(csvrow[1]) },
    //       { $addToSet: { related_products: Number(csvrow[2]) } },
    //       {},
    //       function(error, docs) {
    //         if (error) {
    //           console.log(error);
    //         } else {
    //           console.log(docs);
    //         }
    //       }
    //   );

    //     // records.push(convertedRecord);
    //     // records.push(csvrow);
    // })
    // .on('end',function() {

    //   console.log('Related products added'); //this prints after all rows are handled


    //   //get the current features
    //   //append the new feature
    //   //update the record with the current
    // });



// console.log('test3', records); // this prints first

