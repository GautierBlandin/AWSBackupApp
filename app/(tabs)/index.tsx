import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useNavigation } from 'expo-router';
import UploadButton from '../../components/UploadButton';

function App() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <UploadButton />
    </View>
  );
}

export default App;
