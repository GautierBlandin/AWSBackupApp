import React from 'react';
import { View } from 'react-native';
import UploadButton from '../components/UploadButton';

const App = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <UploadButton />
    </View>
  );
};

export default App;
