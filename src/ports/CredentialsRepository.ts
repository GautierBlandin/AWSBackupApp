export interface CredentialsRepository {
  setAWSAccessKeyId(awsAccessKeyId: string): Promise<void>;
  getAWSAccessKeyId(): Promise<string | undefined>;
  setAWSSecretAccessKey(awsSecretAccessKey: string): Promise<void>;
  getAWSSecretAccessKey(): Promise<string | undefined>;
  setAWSRegion(awsRegion: string): Promise<void>;
  getAWSRegion(): Promise<string | undefined>;
  setBucketName(bucketName: string): Promise<void>;
  getBucketName(): Promise<string | undefined>;
}
