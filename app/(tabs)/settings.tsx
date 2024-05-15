import React, { useEffect, useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const Settings: React.FC = () => {
  const [accessKey, setAccessKey] = useState('');
  const [secretAccessKey, setSecretAccessKey] = useState('');
  const [region, setRegion] = useState('');

  useEffect(() => {
    const fetchCredentials = async () => {
        const accessKey = await AsyncStorage.getItem('AWS_ACCESS_KEY');
        const secretAccessKey = await AsyncStorage.getItem('AWS_SECRET_ACCESS_KEY');
        const region = await AsyncStorage.getItem('AWS_REGION');

        setAccessKey(accessKey || '');
        setSecretAccessKey(secretAccessKey || '');
        setRegion(region || '');
    }
    fetchCredentials();
  }, []);

  const handleSaveCredentials = async () => {
    try {
      await AsyncStorage.setItem('AWS_ACCESS_KEY', accessKey);
      await AsyncStorage.setItem('AWS_SECRET_ACCESS_KEY', secretAccessKey);
      await AsyncStorage.setItem('AWS_REGION', region);
    } catch (error) {
      console.error('Error saving credentials:', error);
    }
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
};

export default Settings;