import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        batchSize: 5,
        arn: {
          "Fn::GetAtt": ["SQSQueue", "Arn"],
        },
      },
    },
  ],
  role: "arn:aws:iam::362343166865:role/AWS_DynamoDB_SNS_SQS",
};
