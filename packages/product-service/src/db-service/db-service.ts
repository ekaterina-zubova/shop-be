import AWS from "aws-sdk";

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
