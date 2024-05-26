import { Progress, Text, YStack } from 'tamagui';
import React from 'react';

interface UploadProgressBarProps {
  uploadProgress: number;
}

export default function UploadProgressBar({ uploadProgress }: UploadProgressBarProps) {
  return (
    <YStack gap={8}>
      <Text textAlign="center">
        Uploading:
        {' '}
        {uploadProgress}
        %
      </Text>
      <Progress value={uploadProgress} max={100} size={`$${6}`}>
        <Progress.Indicator />
      </Progress>
    </YStack>
  );
}
