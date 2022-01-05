// Product Information
{
  "id": Number,
  "name": String,
  "slogan": String,
  "description": String,
  "category": String,
  "default_price": Number,
  "created_at": Date,
  "updated_at": Date,
  "features": [
    {
      "feature": String,
      "value": String
    }
  ],
  "related" [
    Number,
    Number
  ]
}
// Product Styles
{
  "product_id": Number,
  "results": [
    {
      "style_id": Number,
      "name": String,
      "original_price": Number,
      "sale_price": Number,
      "default?": Boolean,
      "photos": [
        {
          "thumbnail_url": String,
          "url": String
        }
      ],
      "skus": {
        String: {
          "quantity": Number,
          "size": String
        }
      }
    }
  ]
}