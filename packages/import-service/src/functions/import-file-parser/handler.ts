import AWS from "aws-sdk";
import * as importService from "@libs/import-service/import-service";
import { AWS_REGION } from "../../constants/constants";

const importFileParser = async (event) => {
  const s3 = new AWS.S3({ region: AWS_REGION });

  console.log("Lambda importFileParser. Event: ", event);

  for (const record of event.Records) {
    console.log("Lambda importFileParser. Record: ", record);

    const bucketName = record.s3.bucket.name;
    const objectKey = record.s3.object.key;

    try {
      const s3Object = await importService.getObject(s3, bucketName, objectKey);
      await importService.createReadStream(s3Object);
      await importService.copyObject(
        s3,
        bucketName,
        objectKey,
        objectKey.replace("uploaded", "parsed")
      );
      await importService.deleteObject(s3, bucketName, objectKey);

      console.log(
        `Lambda importFileParser. Transfer for the folder ${
          objectKey.split("/")[1]
        } was done.`
      );
    } catch (error) {
      console.log("Lambda importFileParser. Moving files error: ", error);
    }
  }
};

export const main = importFileParser;
