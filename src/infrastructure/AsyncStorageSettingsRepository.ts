import AsyncStorage from '@react-native-async-storage/async-storage';
import { SettingsRepository } from '@/ports/SettingsRepository';

export class AsyncStorageSettingsRepository implements SettingsRepository {
  public async setAWSAccessKeyId(awsAccessKeyId: string | undefined): Promise<void> {
    await AsyncStorage.setItem('AWS_ACCESS_KEY', awsAccessKeyId || '');
  }

  public async getAWSAccessKeyId(): Promise<string | undefined> {
    const value = await AsyncStorage.getItem('AWS_ACCESS_KEY');
    return this.nullToUndefined(value);
  }

  public async setAWSSecretAccessKey(awsSecretAccessKey: string | undefined): Promise<void> {
    await AsyncStorage.setItem('AWS_SECRET_ACCESS_KEY', awsSecretAccessKey || '');
  }

  public async getAWSSecretAccessKey(): Promise<string | undefined> {
    const value = await AsyncStorage.getItem('AWS_SECRET_ACCESS_KEY');
    return this.nullToUndefined(value);
  }

  public async setAWSRegion(awsRegion: string | undefined): Promise<void> {
    await AsyncStorage.setItem('AWS_REGION', awsRegion || '');
  }

  public async getAWSRegion(): Promise<string | undefined> {
    const value = await AsyncStorage.getItem('AWS_REGION');
    return this.nullToUndefined(value);
  }

  public async setBucketName(bucketName: string | undefined): Promise<void> {
    await AsyncStorage.setItem('BUCKET_NAME', bucketName || '');
  }

  public async getBucketName(): Promise<string | undefined> {
    const value = await AsyncStorage.getItem('BUCKET_NAME');
    return this.nullToUndefined(value);
  }

  private nullToUndefined(value: string | null): string | undefined {
    if (value === null) {
      return undefined;
    }
    return value;
  }
}
