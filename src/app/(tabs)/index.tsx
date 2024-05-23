import React, { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'tamagui';
import { useNavigation } from 'expo-router';
import { UploadUseCase } from '@/useCases/upload';
import { DisplayableError } from '@/errors/DisplayableError';
import crossPlatformAlert from '@/components/CrossPlatformAlert';

function App() {
  const navigation = useNavigation();

  const uploadUseCase = useMemo(() => new UploadUseCase(), []);

  const handleUpload = async () => {
    try {
      const result = await uploadUseCase.handleUpload();

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
    }
  };

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button backgroundColor="blue" onPress={handleUpload}>
        <Text color="whitesmoke">Upload Images</Text>
      </Button>
    </View>
  );
}

export default App;
