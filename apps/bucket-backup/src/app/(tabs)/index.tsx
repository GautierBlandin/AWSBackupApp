import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { Button, Text, YStack } from 'tamagui';
import { useNavigation } from 'expo-router';
import { UploadUseCase } from '../../useCases/upload';
import { DisplayableError } from '../../errors/DisplayableError';
import crossPlatformAlert from '../../components/CrossPlatformAlert';
import UploadProgressBar from '../../components/UploadProgressBar';
import { FullUploadUseCase } from '../../useCases/fullUpload';
import { AppPermissionsUseCase } from '../../useCases/appPermissions';

function App() {
  const navigation = useNavigation();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const uploadUseCase = useMemo(() => new UploadUseCase(), []);

  const scheduledUploadUseCase = useMemo(() => new FullUploadUseCase(), []);

  const permissionUseCase = useMemo(() => new AppPermissionsUseCase(), []);

  // Request permissions on app start
  useEffect(() => {
    permissionUseCase.requestPermissions();
  }, [permissionUseCase]);

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
          { cancelable: false }
        );
      }
    } catch (error) {
      if (error instanceof DisplayableError) {
        crossPlatformAlert(error.title, error.message, [{ text: 'OK' }], { cancelable: false });
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleScheduledUpload = async () => {
    try {
      const progressCallback = (progress: number) => {
        setUploadProgress(progress);
      };

      await scheduledUploadUseCase.backupNewMedia({
        progressCallback,
        onUploadStart: () => setIsUploading(true),
        onUploadEnd: () => setIsUploading(false),
      });

      crossPlatformAlert(
        'Upload Successful',
        'The selected images have been uploaded successfully.',
        [{ text: 'OK' }],
        { cancelable: false }
      );
    } catch (error) {
      if (error instanceof DisplayableError) {
        crossPlatformAlert(error.title, error.message, [{ text: 'OK' }], { cancelable: false });
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
      {isUploading && <UploadProgressBar uploadProgress={uploadProgress} />}
      <YStack gap={20}>
        {!isUploading && (
          <Button backgroundColor="blue" onPress={handleUpload} disabled={isUploading}>
            <Text color="whitesmoke">{isUploading ? 'Uploading...' : 'Upload Images'}</Text>
          </Button>
        )}
        {!isUploading && (
          <Button backgroundColor="blue" onPress={handleScheduledUpload} disabled={isUploading}>
            <Text color="whitesmoke">Upload All New Images</Text>
          </Button>
        )}
      </YStack>
    </View>
  );
}

export default App;
