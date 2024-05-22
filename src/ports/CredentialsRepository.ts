export interface CredentialsRepository {
  setAWSAccessKeyId(awsAccessKeyId: string | undefined): Promise<void>;
  getAWSAccessKeyId(): Promise<string | undefined>;
  setAWSSecretAccessKey(awsSecretAccessKey: string | undefined): Promise<void>;
  getAWSSecretAccessKey(): Promise<string | undefined>;
  setAWSRegion(awsRegion: string | undefined): Promise<void>;
  getAWSRegion(): Promise<string | undefined>;
  setBucketName(bucketName: string | undefined): Promise<void>;
  getBucketName(): Promise<string | undefined>;
}
