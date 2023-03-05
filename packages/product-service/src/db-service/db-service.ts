import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

AWS.config.update({ region: "eu-west-1" });

const ddb = new AWS.DynamoDB.DocumentClient();

export const getAllTableItems = async (tableName) => {
  const scanResult = await ddb
    .scan({
      TableName: tableName,
    })
    .promise();
  return scanResult.Items;
};

export const queryById = async (table, id) => {
  const { Items = [] } = await ddb
    .query({
      TableName: table,
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id,
      },
    })
    .promise();

  return Items[0];
};

export const putItem = async (tableName, data) => {
  const params = {
    TableName: tableName,
    Item: Object.assign(
      {
        id: uuidv4(),
        title: data.title,
      },
      data.description ? { description: data.description } : null,
      data.price ? { price: data.price } : null
    ),
  };

  return ddb.put(params).promise();
};
