import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { queryById } from "@db-service/db-service";

import schema from "./schema";

const getProductById: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  try {
    const { productId } = event.pathParameters;
    const product = await queryById(process.env.BOOKSHOP_PRODUCTS_TABLE, productId);

    if (!product) {
      return formatJSONResponse(
        {
          message: "Product not found...",
        },
        404,
        event.headers
      );
    }

    return formatJSONResponse(product, 200, event.headers);
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

export const main = middyfy(getProductById);
