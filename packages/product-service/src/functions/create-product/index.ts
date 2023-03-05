import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "post",
        path: "products",
        cors: {
          headers: [
            "Access-Control-Allow-Origin",
            "Access-Control-Request-Headers",
          ],
          methods: ["POST" as "POST", "OPTIONS" as "OPTIONS"],
          origin: "*",
        },
      },
    },
  ],
  role: "arn:aws:iam::362343166865:role/DynamoDBLambdaAccessRole",
};
