import React from 'react';
import { Button, Alert } from 'react-native';
import { UploadUseCase } from '@/useCases/upload';
import { DisplayableError } from '@/errors/DisplayableError';

function UploadButton() {
  const uploadUseCase = new UploadUseCase();

  const handleUpload = async () => {
    try {
      await uploadUseCase.handleUpload();

      Alert.alert(
        'Upload Successful',
        'The selected images have been uploaded successfully.',
        [{ text: 'OK' }],
        { cancelable: false },
      );
    } catch (error) {
      if (error instanceof DisplayableError) {
        Alert.alert(
          error.title,
          error.message,
          [{ text: 'OK' }],
          { cancelable: false },
        );
      }
    }
  };

  return <Button title="Upload Images" onPress={handleUpload} />;
}

export default UploadButton;
