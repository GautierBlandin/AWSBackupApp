import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { Button, Text, Progress } from 'tamagui';
import { useNavigation } from 'expo-router';
import { UploadUseCase } from '@/useCases/upload';
import { DisplayableError } from '@/errors/DisplayableError';
import crossPlatformAlert from '@/components/CrossPlatformAlert';

function App() {
  const navigation = useNavigation();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const uploadUseCase = useMemo(() => new UploadUseCase(), []);

  const handleUpload = async () => {
    try {
      const progressCallback = (progress: number) => {
        setUploadProgress(progress);
      };

      const result = await uploadUseCase.handleUpload({
        progressCallback,
        onUploadStart: () => setIsUploading(true),
        onUploadEnd: () => setIsUploading(false),
      });

      if (result.status === 'success') {
        crossPlatformAlert(
          'Upload Successful',
          'The selected images have been uploaded successfully.',
          [{ text: 'OK' }],
          { cancelable: false },
        );
      }
    } catch (error) {
      if (error instanceof DisplayableError) {
        crossPlatformAlert(
          error.title,
          error.message,
          [{ text: 'OK' }],
          { cancelable: false },
        );
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {isUploading && (
        <View style={{ marginBottom: 20 }}>
          <Text>
            Uploading:
            {uploadProgress}
            %
          </Text>
          <Progress value={uploadProgress} max={100}>
            <Progress.Indicator />
          </Progress>
        </View>
      )}
      {!isUploading && (
      <Button backgroundColor="blue" onPress={handleUpload} disabled={isUploading}>
        <Text color="whitesmoke">{isUploading ? 'Uploading...' : 'Upload Images'}</Text>
      </Button>
      )}
    </View>
  );
}

export default App;
