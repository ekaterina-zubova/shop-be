import { v4 as uuidv4 } from "uuid";
import { putItem } from "@db-service/db-service";

const catalogBatchProcess = async (event) => {
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
    }
    console.log(products, "products");
  } catch (error) {
    console.log("Error", error);
  }
};

export const main = catalogBatchProcess;
