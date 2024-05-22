import React, { useEffect, useMemo, useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { SettingsUseCase } from '@/useCases/settings';

function Settings() {
  const [accessKey, setAccessKey] = useState('');
  const [secretAccessKey, setSecretAccessKey] = useState('');
  const [region, setRegion] = useState('');
  const [bucketName, setBucketName] = useState('');

  const settingsUseCase = useMemo(() => new SettingsUseCase(), []);

  useEffect(() => {
    const fetchCredentials = async () => {
      const credentials = await settingsUseCase.loadCredentials();
      setAccessKey(credentials.accessKey || '');
      setSecretAccessKey(credentials.secretAccessKey || '');
      setRegion(credentials.region || '');
      setBucketName(credentials.bucketName || '');
    };
    fetchCredentials();
  }, [settingsUseCase]);

  const handleSaveCredentials = async () => {
    await settingsUseCase.saveCredentials({
      accessKey,
      secretAccessKey,
      region,
      bucketName,
    });
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
      <TextInput
        placeholder="Bucket Name"
        value={bucketName}
        onChangeText={setBucketName}
      />
      <Button title="Save Credentials" onPress={handleSaveCredentials} />
    </View>
  );
}

export default Settings;
