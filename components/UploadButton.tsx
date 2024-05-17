import React from 'react';
import { Button, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { toByteArray } from 'base64-js';
import AWS from 'aws-sdk';
import { inject } from '@ab/di-container';
import { credentialsRepositoryToken } from '@/ports/CredentialsRepository.token';
import awsConfig from '../aws-config.json';

function UploadButton() {
  const credentialsRepository = inject(credentialsRepositoryToken);

  const handleUpload = async () => {
    try {
      const accessKey = await credentialsRepository.getAWSAccessKeyId();
      const secretAccessKey = await credentialsRepository.getAWSSecretAccessKey();
      const region = await credentialsRepository.getAWSRegion();

      if (!accessKey || !secretAccessKey || !region) {
        Alert.alert(
          'Credentials Missing',
          'Please save your AWS credentials in the settings screen before uploading images.',
          [{ text: 'OK' }],
          { cancelable: false },
        );
        return;
      }

      const credentials = new AWS.Credentials({
        accessKeyId: accessKey,
        secretAccessKey,
      });

      AWS.config.update({
        credentials,
        region,
      });

      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'You need to grant permission to access the media library in order to upload images.',
          [{ text: 'OK' }],
          { cancelable: false },
        );
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
            return undefined;
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

          const s3 = new AWS.S3();

          return s3.upload(params).promise();
        });

        await Promise.all(uploadPromises);

        Alert.alert(
          'Upload Successful',
          'The selected images have been uploaded successfully.',
          [{ text: 'OK' }],
          { cancelable: false },
        );
      }
    } catch (error) {
      Alert.alert(
        'Upload Error',
        'An error occurred while uploading the images. Please try again.',
        [{ text: 'OK' }],
        { cancelable: false },
      );
    }
  };

  return <Button title="Upload Images" onPress={handleUpload} />;
}

export default UploadButton;
