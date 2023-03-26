import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "/import",
        request: {
          parameters: {
            querystrings: {
              fileName: true,
            },
          },
        },
        authorizer: {
          name: "basicAuthorizer",
          arn: "arn:aws:lambda:eu-west-1:362343166865:function:authorization-service-dev-basicAuthorizer",
          type: "token",
          identitySource: "method.request.header.Authorization",
        },
        cors: true,
      },
    },
  ],
};
