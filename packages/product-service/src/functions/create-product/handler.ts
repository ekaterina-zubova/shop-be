import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { putItem } from "@db-service/db-service";

import schema from "./schema";

const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  try {
    const data = JSON.parse(event.body);
    await putItem(process.env.BOOKSHOP_PRODUCTS_TABLE, data);

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
