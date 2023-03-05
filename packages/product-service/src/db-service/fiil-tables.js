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

const fillTables = () => {
  MOCK_PRODUCT_LIST.forEach(async (item) => {
    const productId = uuidv4();

    const productsTableParams = {
      TableName: process.env.BOOKSHOP_PRODUCTS_TABLE,
      Item: {
        id: { S: productId },
        title: { S: item.title },
        description: { S: item.description },
        price: { N: item.price },
      },
    };

    await addItem(productsTableParams);

    const stocksTableParams = {
      TableName: process.env.BOOKSHOP_STOCKS_TABLE,
      Item: {
        product_id: { S: productId },
        count: { N: item.count },
      },
    };

    await addItem(stocksTableParams);
  });
};

fillTables();
