// var db = connect("127.0.0.1:27017/sdc");
let conn = new Mongo("127.0.0.1:27017");
let db = conn.getDB("sdc");

db.features.aggregate(
  [
    {$group: {
      _id: "$product_id",
       "features": {$push:{
         feature: "$feature",
          value: "$value"}
        }
      }
    },
    { $merge: {
      into: "product",
      on: "id",
      whenMatched: "merge",
      whenNotMatched: "discard"
    }
    }
], { "allowDiskUse" : true })