import AsyncStorage from '@react-native-async-storage/async-storage';
import { CredentialsRepository } from '@/ports/CredentialsRepository';

export class AsyncStorageCredentialsRepository implements CredentialsRepository {
  public async setAWSAccessKeyId(awsAccessKeyId: string): Promise<void> {
    await AsyncStorage.setItem('AWS_ACCESS_KEY', awsAccessKeyId);
  }

  public async getAWSAccessKeyId(): Promise<string | undefined> {
    const value = await AsyncStorage.getItem('AWS_ACCESS_KEY');
    return this.nullToUndefined(value);
  }

  public async setAWSSecretAccessKey(awsSecretAccessKey: string): Promise<void> {
    await AsyncStorage.setItem('AWS_SECRET_ACCESS_KEY', awsSecretAccessKey);
  }

  public async getAWSSecretAccessKey(): Promise<string | undefined> {
    const value = await AsyncStorage.getItem('AWS_SECRET_ACCESS_KEY');
    return this.nullToUndefined(value);
  }

  public async setAWSRegion(awsRegion: string): Promise<void> {
    await AsyncStorage.setItem('AWS_REGION', awsRegion);
  }

  public async getAWSRegion(): Promise<string | undefined> {
    const value = await AsyncStorage.getItem('AWS_REGION');
    return this.nullToUndefined(value);
  }

  private nullToUndefined(value: string | null): string | undefined {
    if (value === null) {
      return undefined;
    }
    return value;
  }
}
