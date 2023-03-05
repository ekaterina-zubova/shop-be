import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { logEvent } from "@libs/logger";
import { queryById } from "@db-service/db-service";

import schema from "./schema";

const getProductById: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  try {
    const { productId } = event.pathParameters;
    const product = await queryById(
      process.env.BOOKSHOP_PRODUCTS_TABLE,
      productId
    );

    if (!product) {
      const message = "Product not found...";

      logEvent({
        eventName: "getProductById",
        result: message,
        requestParams: `id=${productId}`,
      });

      return formatJSONResponse(
        {
          message,
        },
        404,
        event.headers
      );
    }

    logEvent({
      eventName: "getProductById",
      result: JSON.stringify(product),
      requestParams: `id=${productId}`,
    });

    return formatJSONResponse(product, 200, event.headers);
  } catch (error) {
    logEvent({
      eventName: "getProductById",
      result: error.message,
      requestParams: `id=${event.pathParameters?.productId}`,
    });

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
