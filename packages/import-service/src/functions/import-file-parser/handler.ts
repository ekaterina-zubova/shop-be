import AWS from "aws-sdk";
import * as importService from "@libs/import-service/import-service";
import { AWS_REGION } from "../../constants/constants";

const importFileParser = async (event) => {
  const s3 = new AWS.S3({ region: AWS_REGION });
  console.log("Lambda importFileParser. Event: ", event);
  const sqs = new AWS.SQS();

  for (const record of event.Records) {
    console.log("Lambda importFileParser. Record: ", record);

    const bucketName = record.s3.bucket.name;
    const objectKey = record.s3.object.key;

    const callback = (data) => {
      try {
        sqs.sendMessage(
          {
            QueueUrl: process.env.SQS_URL,
            MessageBody: JSON.stringify(data),
          },
          () => {
            console.log("send message for ....", "record");
          }
        );
      } catch {
        console.log("Sent message error");
      }
    };

    try {
      const s3Object = await importService.getObject(s3, bucketName, objectKey);
      await importService.createReadStream(s3Object, callback);
      await importService.copyObject(
        s3,
        bucketName,
        objectKey,
        objectKey.replace("uploaded", "parsed")
      );
      await importService.deleteObject(s3, bucketName, objectKey);

      console.log(
        `Lambda importFileParser. File transfer ${
          objectKey.split("/")[1]
        } completed.`
      );
    } catch (error) {
      console.log("Lambda importFileParser. Moving files error: ", error);
    }
  }
};

export const main = importFileParser;
