import { SettingsRepository } from './SettingsRepository';

export class MockSettingsRepository implements SettingsRepository {
  private awsAccessKeyId: string | undefined;

  private awsSecretAccessKey: string | undefined;

  private awsRegion: string | undefined;

  private bucketName: string | undefined;

  private bucketDirectory: string | undefined;

  async setAWSAccessKeyId(awsAccessKeyId: string | undefined): Promise<void> {
    this.awsAccessKeyId = awsAccessKeyId;
  }

  async getAWSAccessKeyId(): Promise<string | undefined> {
    return this.awsAccessKeyId;
  }

  async setAWSSecretAccessKey(awsSecretAccessKey: string | undefined): Promise<void> {
    this.awsSecretAccessKey = awsSecretAccessKey;
  }

  async getAWSSecretAccessKey(): Promise<string | undefined> {
    return this.awsSecretAccessKey;
  }

  async setAWSRegion(awsRegion: string | undefined): Promise<void> {
    this.awsRegion = awsRegion;
  }

  async getAWSRegion(): Promise<string | undefined> {
    return this.awsRegion;
  }

  async setBucketName(bucketName: string | undefined): Promise<void> {
    this.bucketName = bucketName;
  }

  async getBucketName(): Promise<string | undefined> {
    return this.bucketName;
  }

  async getBucketDirectory(): Promise<string | undefined> {
    return this.bucketDirectory;
  }

  async setBucketDirectory(bucketDirectory: string | undefined): Promise<void> {
    this.bucketDirectory = bucketDirectory;
  }
}
