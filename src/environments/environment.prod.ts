export const environment = {
  production: false,
  serverUrl:'http://13.127.174.94:3350/',
  api_getBuyer:'buyers',
  api_updateBuyer:'buyers/update',
  api_CreateBuyer:'buyers/create',
  api_approveBuyer:'buyers/approve/',
  api_updateManufacturer:'manufacturers/update',
  api_CreateManufacturer:'manufacturers/create',
  api_rejectBuyer:'buyers/reject',
  api_updateBuyerProduct:'buyers/updateProducts',
  api_getManufacturer:'manufacturers',
  api_getManufacturersWithCategories:'manufacturers/getAllWithCategories',
  api_approveManufacturer:'manufacturers/approve/',
  api_rejectManufacturer:'manufacturers/reject',
  //api_updateManufacturer:'',
  //api_CreateManufacturer:'',
  api_uploadFormFiles:'upload',
  api_products:'products',
  api_productPricing:'productpricing',

  api_pricingZone:'pricingZones',

  api_subcategories:'subcategories',
  api_manufacturers:'manufacturers',
  api_productTypes:'productTypes',
  api_brands:'brands',
  api_states:'states',
  api_getStates: 'states',
  api_createProductPricing:'productPricing/create',
  api_updateProductPricing:'productPricing/update',
  api_createProductPricingBuyer:'productPricingToBuyer/create',
  api_updateProductPricingBuyer:'productPricingToBuyer/update',
  api_getProductPricingBuyer:'productPricingToBuyer',
  api_getViewHistory:'productPricing/getHistory',
  api_getViewHistoryBuyer:'productPricingToBuyer/getHistory',
  api_Location: 'getAllLocation',
  api_Seller:'api/getSellers',

  //http://13.127.174.94:3350/productpricing
  //http://13.127.174.94:3350/pricingZones
  //http://13.127.174.94:3350/products

  permissionConfigurations: [
    {
      "name": "Manufacturer",
      "isActive": false,
      "permissions": [
        {
          "code": "101",
          "name": "Add/Edit Manufacturer",
          "isActive": false
        },
        {
          "code": "102",
          "name": "Approve/Reject Manufacturer",
          "isActive": false
        }
      ],
      "permissionsCodes": ["101", "102"]
    },
    {
      "name": "Buyers",
      "isActive": false,
      "permissions": [
        {
          "code": "201",
          "name": "Add/Edit Buyers",
          "isActive": false
        },
        {
          "code": "202",
          "name": "Approve/Reject Buyers",
          "isActive": false
        }
      ],
      "permissionsCodes": ["201", "202"]
    },
    {
      "name": "Pricing Zone",
      "isActive": false,
      "permissions": [
        {
          "code": "300",
          "name": "Pricing Zone",
          "isActive": false
        }
      ],
      "permissionsCodes": ["300"]
    },
    {
      "name": "Pricing",
      "isActive": false,
      "permissions": [
        {
          "code": "400",
          "name": "Manufacturer Product Pricing",
          "isActive": false
        },
        {
          "code": "500",
          "name": "mSupply Pricing to Buyer",
          "isActive": false
        }
      ],
      "permissionsCodes": ["400", "500"]
    },
    {
      "name": "Buyer Purchase Order",
      "isActive": false,
      "permissions": [
        {
          "code": "601",
          "name": "View PO",
          "isActive": false
        },
        {
          "code": "602",
          "name": "Edit PO",
          "isActive": false
        },
        {
          "code": "603",
          "name": "Approve reject PO",
          "isActive": false
        }
      ],
      "permissionsCodes": ["601", "602", "603"]
    }
  ]

};