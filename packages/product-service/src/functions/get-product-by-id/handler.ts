import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import MOCK_PRODUCT_LIST from "@functions/products-mock.json";

import schema from "./schema";

const getProductById: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  try {
    const { productId } = event.pathParameters;

    const product = MOCK_PRODUCT_LIST.find(
      (prod) => prod.id === productId
    );

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
