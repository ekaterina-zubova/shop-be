import type { AWS } from "@serverless/typescript";

import { getProductList } from "@functions/index";
import { getProductById } from "@functions/index";
import { createProduct } from "@functions/index";

const serverlessConfiguration: AWS = {
  service: "product-service",
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
      BOOKSHOP_PRODUCTS_TABLE: "${env:BOOKSHOP_PRODUCTS_TABLE}",
      BOOKSHOP_STOCKS_TABLE: "${env:BOOKSHOP_STOCKS_TABLE}",
    },
    region: "eu-west-1",
    stage: "dev",
  },
  useDotenv: true,
  // import the function via paths
  functions: { getProductList, getProductById, createProduct },
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
};

module.exports = serverlessConfiguration;
