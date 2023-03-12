import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import AWS from "aws-sdk";
import { AWS_REGION, BUCKET_NAME } from "../../constants/constants";

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<
  undefined
> = async (event) => {
  try {
    const s3 = new AWS.S3({ region: AWS_REGION });

    const { fileName } = event.queryStringParameters;

    if (!fileName) {
      return formatJSONResponse(
        {
          message: "Can not get file name",
        },
        404
      );
    }

    const params = {
      Bucket: BUCKET_NAME,
      Key: `uploaded/${fileName}`,
      Expires: 60,
      ContentType: "text/csv",
    };

    const url = s3.getSignedUrl("putObject", params);

    if (!url) {
      return formatJSONResponse(
        {
          message: "Can not get URL",
        },
        500
      );
    }

    return formatJSONResponse({ url }, 200);
  } catch (error) {
    return formatJSONResponse(
      {
        message: error.message,
      },
      500
    );
  }
};

export const main = middyfy(importProductsFile);
