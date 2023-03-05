const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const MOCK_PRODUCT_LIST = require("./products-mock.json");

require("dotenv").config();
AWS.config.update({ region: "eu-west-1" });

const ddb = new AWS.DynamoDB();

const addItem = (params) => {
  ddb.putItem(params, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data);
    }
  });
};

const fillProductsTable = () => {
  MOCK_PRODUCT_LIST.forEach(async (item) => {
    const params = {
      TableName: process.env.BOOKSHOP_PRODUCTS_TABLE,
      Item: {
        id: { S: uuidv4() },
        title: { S: item.title },
        description: { S: item.description },
        price: { N: item.price },
      },
    };

    await addItem(params);
  });
};

fillProductsTable();

const fillStocksTable = () => {
  ddb.scan(
    {
      TableName: process.env.BOOKSHOP_PRODUCTS_TABLE,
    },
    function (err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        data.Items.forEach(async (element) => {
          const params = {
            TableName: process.env.BOOKSHOP_STOCKS_TABLE,
            Item: {
              product_id: { S: element.id.S },
              count: { N: `${Math.floor(Math.random() * 10)}` },
            },
          };

          await addItem(params);
        });
      }
    }
  );
};

fillStocksTable();
