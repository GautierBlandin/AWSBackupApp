export interface SettingsRepository {
  setAWSAccessKeyId(awsAccessKeyId: string | undefined): Promise<void>;
  getAWSAccessKeyId(): Promise<string | undefined>;
  setAWSSecretAccessKey(awsSecretAccessKey: string | undefined): Promise<void>;
  getAWSSecretAccessKey(): Promise<string | undefined>;
  setAWSRegion(awsRegion: string | undefined): Promise<void>;
  getAWSRegion(): Promise<string | undefined>;
  setBucketName(bucketName: string | undefined): Promise<void>;
  getBucketName(): Promise<string | undefined>;
  getBucketDirectory(): Promise<string | undefined>;
  setBucketDirectory(bucketDirectory: string | undefined): Promise<void>;
}
