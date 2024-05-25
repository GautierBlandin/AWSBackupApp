import React, { useEffect, useMemo, useState } from 'react';

import { SettingsUseCase } from '@/useCases/settings';
import crossPlatformAlert from '@/components/CrossPlatformAlert';
import {
  Button, Input, Text, View, YStack,
} from 'tamagui';

function FormInput({
  label, value, onChangeText, secureTextEntry,
}: {
  label: string,
  value: string,
  onChangeText: (text: string) => void,
  secureTextEntry?: boolean,
}) {
  return (
    <View>
      <YStack>
        <Text fontSize={12} padding={2} marginLeft={4}>{label}</Text>
        <Input
          placeholder={label}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
        />
      </YStack>
    </View>
  );
}

function Settings() {
  const [accessKey, setAccessKey] = useState('');
  const [secretAccessKey, setSecretAccessKey] = useState('');
  const [region, setRegion] = useState('');
  const [bucketName, setBucketName] = useState('');
  const [bucketDirectory, setBucketDirectory] = useState('');

  const settingsUseCase = useMemo(() => new SettingsUseCase(), []);

  useEffect(() => {
    const fetchCredentials = async () => {
      const credentials = await settingsUseCase.loadCredentials();
      setAccessKey(credentials.accessKey || '');
      setSecretAccessKey(credentials.secretAccessKey || '');
      setRegion(credentials.region || '');
      setBucketName(credentials.bucketName || '');
      setBucketDirectory(credentials.bucketDirectory || '');
    };
    fetchCredentials();
  }, [settingsUseCase]);

  const handleSaveCredentials = async () => {
    await settingsUseCase.saveCredentials({
      accessKey,
      secretAccessKey,
      region,
      bucketName,
      bucketDirectory,
    });

    crossPlatformAlert('Credentials Saved', 'Your credentials have been saved.', [{ text: 'OK' }], { cancelable: false });
  };

  return (
    <View>
      <YStack margin={16} gap={16}>
        <FormInput
          label="Access Key"
          value={accessKey}
          onChangeText={setAccessKey}
        />
        <FormInput
          label="Secret Access Key"
          value={secretAccessKey}
          onChangeText={setSecretAccessKey}
          secureTextEntry
        />
        <FormInput
          label="Region"
          value={region}
          onChangeText={setRegion}
        />
        <FormInput
          label="Bucket Name"
          value={bucketName}
          onChangeText={setBucketName}
        />
        <FormInput
          label="Bucket Directory"
          value={bucketDirectory}
          onChangeText={setBucketDirectory}
        />
        <Button
          backgroundColor="blue"
          onPress={handleSaveCredentials}
        >
          <Text color="whitesmoke">Save Credentials</Text>
        </Button>
      </YStack>
    </View>
  );
}

export default Settings;
