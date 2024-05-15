import React, { useEffect } from 'react';
import { View } from 'react-native';
import UploadButton from '../../components/UploadButton';
import { useNavigation } from 'expo-router';

const App = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <UploadButton />
    </View>
  );
};

export default App;
