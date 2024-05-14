import React from 'react';
import { Button } from 'react-native';
import AWS from 'aws-sdk';
import awsConfig from '../aws-config.json';

const credentials = new AWS.Credentials({
  accessKeyId: awsConfig.accessKeyId,
  secretAccessKey: awsConfig.secretAccessKey,
});

AWS.config.update({
  credentials: credentials,
  region: awsConfig.region,
});

const s3 = new AWS.S3();

const UploadButton = () => {
  const handleUpload = async () => {
    try {
      const fileContent = 'Hello, World!';
      const params = {
        Bucket: awsConfig.bucketName,
        Key: 'hello-world.txt',
        Body: fileContent,
      };

      await s3.upload(params).promise();
      console.log('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <Button title="Upload hello-world.txt" onPress={handleUpload} />
  );
};

export default UploadButton;
