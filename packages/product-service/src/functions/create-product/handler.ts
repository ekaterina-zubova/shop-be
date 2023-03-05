import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { putItem } from "@db-service/db-service";
import { v4 as uuidv4 } from "uuid";

import schema from "./schema";

const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  try {
    const data = event.body;
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

    return formatJSONResponse({}, 200, event.headers);
  } catch (error) {
    return formatJSONResponse(
      {
        message: error.message,
      },
      500,
      event.headers
    );
  }
};

export const main = middyfy(createProduct);
