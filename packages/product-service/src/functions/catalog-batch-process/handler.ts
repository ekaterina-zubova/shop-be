import { v4 as uuidv4 } from "uuid";
import { putItem } from "@db-service/db-service";
import AWS from "aws-sdk";
import { AWS_REGION } from "../../constants/constants";

const catalogBatchProcess = async (event) => {
  const sns = new AWS.SNS({ region: AWS_REGION });

  console.log("Catalog batch process");
  try {
    console.log(event.Records, "Records");
    const products = event.Records.map(({ body }) => JSON.parse(body));

    if (products.length === 0) {
      console.log("Products not found");
    }

    for (const data of products) {
      const productId = uuidv4();
      const product = {
        id: productId,
        title: data.title,
        description: data.description,
        price: data.price,
      };
      await putItem(process.env.BOOKSHOP_PRODUCTS_TABLE, product);
      await putItem(process.env.BOOKSHOP_STOCKS_TABLE, {
        ["product_id"]: productId,
        count: data.count,
      });
      sns.publish(
        {
          Subject: "New product has been created",
          Message: JSON.stringify(product),
          TopicArn: process.env.SNS_ARN,
        },
        (data) => {
          console.log("sns message", data);
        }
      );
    }
    console.log(products, "products");
  } catch (error) {
    console.log("Error", error);
  }
};

export const main = catalogBatchProcess;
