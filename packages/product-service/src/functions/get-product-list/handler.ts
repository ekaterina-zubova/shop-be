import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { logEvent } from "@libs/logger";
import { getAllTableItems } from "@db-service/db-service";

import schema from "./schema";

const getProductList: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  try {
    const products = await getAllTableItems(
      process.env.BOOKSHOP_PRODUCTS_TABLE
    );
    const stocks = await getAllTableItems(process.env.BOOKSHOP_STOCKS_TABLE);
    const result = products.map((item) => {
      const productInStock = stocks.find(
        ({ product_id }) => product_id === item.id
      );

      return productInStock ? { ...item, count: productInStock.count } : item;
    });

    logEvent({
      eventName: "getProductList",
      result: `${products.length} products`,
    });

    return formatJSONResponse(result, 200, event.headers);
  } catch (error) {
    logEvent({ eventName: "getProductList", result: error.message });

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
