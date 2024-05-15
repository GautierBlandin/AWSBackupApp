import React from 'react';
import { Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { toByteArray } from 'base64-js';
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
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission denied');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsMultipleSelection: true,
      });

      if (!result.canceled) {
        const uploadPromises = result.assets.map(async (asset) => {
          const fileUri = asset.uri;
          const fileInfo = await FileSystem.getInfoAsync(fileUri);

          if (!fileInfo.exists) {
            console.log('File does not exist');
            return;
          }

          const fileContent = await FileSystem.readAsStringAsync(fileUri, {
            encoding: FileSystem.EncodingType.Base64,
          });

          const uint8Array = toByteArray(fileContent);

          const params = {
            Bucket: awsConfig.bucketName,
            Key: asset.fileName || 'image.jpg',
            Body: uint8Array,
            ContentType: 'image/jpeg',
          };

          return s3.upload(params).promise();
        });

        await Promise.all(uploadPromises);
        console.log('Images uploaded successfully');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  return <Button title="Upload Images" onPress={handleUpload} />;
};

export default UploadButton;
