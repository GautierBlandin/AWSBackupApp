import React, { useEffect, useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { inject } from '@ab/di-container';
import { credentialsRepositoryToken } from '@/ports/CredentialsRepository.token';

function Settings() {
  const [accessKey, setAccessKey] = useState('');
  const [secretAccessKey, setSecretAccessKey] = useState('');
  const [region, setRegion] = useState('');
  const [bucketName, setBucketName] = useState('');

  const credentialsRepository = inject(credentialsRepositoryToken);

  useEffect(() => {
    const fetchCredentials = async () => {
      const existingAccessKey = await credentialsRepository.getAWSAccessKeyId();
      const existingSecretAccessKey = await credentialsRepository.getAWSSecretAccessKey();
      const existingRegion = await credentialsRepository.getAWSRegion();
      const existingBucketName = await credentialsRepository.getBucketName();

      setAccessKey(existingAccessKey || '');
      setSecretAccessKey(existingSecretAccessKey || '');
      setRegion(existingRegion || '');
      setBucketName(existingBucketName || '');
    };
    fetchCredentials();
  }, [credentialsRepository]);

  const handleSaveCredentials = async () => {
    await credentialsRepository.setAWSAccessKeyId(accessKey);
    await credentialsRepository.setAWSSecretAccessKey(secretAccessKey);
    await credentialsRepository.setAWSRegion(region);
    await credentialsRepository.setBucketName(bucketName);
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
