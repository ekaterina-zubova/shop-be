import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import MOCK_PRODUCT_LIST from "@functions/products-mock.json";

import schema from "./schema";

const getProductList: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  try {
    return formatJSONResponse(MOCK_PRODUCT_LIST, 200, event.headers);
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

export const main = middyfy(getProductList);
