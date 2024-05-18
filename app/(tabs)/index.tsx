import React, { useEffect } from 'react';
import { Alert, Button, View } from 'react-native';
import { useNavigation } from 'expo-router';
import { UploadUseCase } from '@/useCases/upload';
import { DisplayableError } from '@/errors/DisplayableError';

function App() {
  const navigation = useNavigation();

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

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Upload Images" onPress={handleUpload} />
    </View>
  );
}

export default App;
