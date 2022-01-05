//Products - is this one necessary? - I don't think so - not worth the space to duplicate

{
    "id": Number,
    "name": String,
    "slogan": String,
    "description": String,
    "category": String,
    "default_price": Number
}

//Product Information
{
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
    ],
    "related_products": [
        Number,
        Number
    ]
}

//Product Styles
{
    "product_id": String,
    "results": [
    	{
            "style_id": Number,
            "name": String,
            "original_price": String,
            "sale_price": String,
            "default?": Boolean,
            "photos": [
  			{
                    "thumbnail_url": String,
                    "url": String
                }
            ],
        "skus": {
                String: {
                    		"quantity": String,
                    		"size": String
                	}
            	}
        }
    ]
}

//Related Products
{
    "product_id": 23, //Connects to ID on line 14
    "related_products": [
        2,
        3,
        8,
        7
      ]
}
