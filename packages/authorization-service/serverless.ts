import type { AWS } from "@serverless/typescript";

import basicAuthorizer from "@functions/basic-authorizer";

const serverlessConfiguration: AWS = {
  service: "authorization-service",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      ekaterina_zubova: "${env:ekaterina_zubova}",
    },
    region: "eu-west-1",
  },
  useDotenv: true,
  // import the function via paths
  functions: { basicAuthorizer },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
  resources: {
    Outputs: {
      BasicAuthorizerOutput: {
        Value: {
          "Fn::GetAtt": ["BasicAuthorizerLambdaFunction", "Arn"],
        },
        Export: { Name: "BasicAuthorizerOutput" },
      },
    },
  },
};

module.exports = serverlessConfiguration;
