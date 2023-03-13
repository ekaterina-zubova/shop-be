import csv from "csv-parser";

export const getObject = async (s3, bucketName, objectKey) => {
  return s3.getObject({
      Bucket: bucketName,
      Key: objectKey,
  });
};

export const createReadStream = async (s3Object) => {
  s3Object
    .createReadStream()
    .pipe(csv())
    .on("data", (data) => console.log(data));

  return s3Object;
};

export const copyObject = async (s3, bucketName, objectKey, copiedObjectKey) => {
  return s3
    .copyObject({
      Bucket: bucketName,
      CopySource: `${bucketName}/${objectKey}`,
      Key: copiedObjectKey,
    })
    .promise();
};

export const deleteObject = async (s3, bucketName, objectKey) => {
  return s3
    .deleteObject({
      Bucket: bucketName,
      Key: objectKey,
    })
    .promise();
};
