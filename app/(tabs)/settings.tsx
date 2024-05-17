import React, { useEffect, useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Settings() {
  const [accessKey, setAccessKey] = useState('');
  const [secretAccessKey, setSecretAccessKey] = useState('');
  const [region, setRegion] = useState('');

  useEffect(() => {
    const fetchCredentials = async () => {
      const existingAccessKey = await AsyncStorage.getItem('AWS_ACCESS_KEY');
      const existingSecretAccessKey = await AsyncStorage.getItem('AWS_SECRET_ACCESS_KEY');
      const existingRegion = await AsyncStorage.getItem('AWS_REGION');

      setAccessKey(existingAccessKey || '');
      setSecretAccessKey(existingSecretAccessKey || '');
      setRegion(existingRegion || '');
    };
    fetchCredentials();
  }, []);
  // some really long comment that should be wrapped to 140 characters or less. more comment here. more comment yet. now overflowingaaaaaaaaaaaaaaaaaaaa
  const handleSaveCredentials = async () => {
    await AsyncStorage.setItem('AWS_ACCESS_KEY', accessKey);
    await AsyncStorage.setItem('AWS_SECRET_ACCESS_KEY', secretAccessKey);
    await AsyncStorage.setItem('AWS_REGION', region);
  };

  return (
    <View>
      <TextInput
        placeholder="Access Key"
        value={accessKey}
        onChangeText={setAccessKey}
      />
      <TextInput
        placeholder="Secret Access Key"
        value={secretAccessKey}
        onChangeText={setSecretAccessKey}
        secureTextEntry
      />
      <TextInput
        placeholder="Region"
        value={region}
        onChangeText={setRegion}
      />
      <Button title="Save Credentials" onPress={handleSaveCredentials} />
    </View>
  );
}

export default Settings;
