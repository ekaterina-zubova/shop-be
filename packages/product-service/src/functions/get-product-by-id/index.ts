import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "products/{productId}",
        request: {
          parameters: {
            paths: {
              productId: true,
            },
          },
        },
        cors: {
          headers: [
            "Access-Control-Allow-Origin",
            "Access-Control-Request-Headers",
          ],
          methods: ["GET" as "GET", "OPTIONS" as "OPTIONS"],
          origin: "*",
        },
      },
    },
  ],
};
