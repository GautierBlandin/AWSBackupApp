import { inject } from '@ab/di-container';
import { settingsRepositoryToken } from '@/ports/SettingsRepository.token';

interface Credentials {
  accessKey: string | undefined;
  secretAccessKey: string | undefined;
  region: string | undefined;
  bucketName: string | undefined;
  bucketDirectory: string | undefined;
}

export class SettingsUseCase {
  private readonly credentialsRepository = inject(settingsRepositoryToken);

  private credentials: Credentials = {
    accessKey: undefined,
    secretAccessKey: undefined,
    region: undefined,
    bucketName: undefined,
    bucketDirectory: undefined,
  };

  public async loadCredentials() {
    const promises = [
      this.credentialsRepository.getAWSAccessKeyId(),
      this.credentialsRepository.getAWSSecretAccessKey(),
      this.credentialsRepository.getAWSRegion(),
      this.credentialsRepository.getBucketName(),
      this.credentialsRepository.getBucketDirectory(),
    ];

    const [existingAccessKey,
      existingSecretAccessKey,
      existingRegion,
      existingBucketName,
      existingBucketDirectory,
    ] = await Promise.all(promises);

    this.credentials = {
      accessKey: existingAccessKey,
      secretAccessKey: existingSecretAccessKey,
      region: existingRegion,
      bucketName: existingBucketName,
      bucketDirectory: existingBucketDirectory,
    };

    return { ...this.credentials };
  }

  public async saveCredentials({
    accessKey,
    secretAccessKey,
    region,
    bucketName,
    bucketDirectory,
  }: Credentials) {
    this.credentials = {
      accessKey,
      secretAccessKey,
      region,
      bucketName,
      bucketDirectory,
    };

    const promises = [
      this.credentialsRepository.setAWSAccessKeyId(accessKey),
      this.credentialsRepository.setAWSSecretAccessKey(secretAccessKey),
      this.credentialsRepository.setAWSRegion(region),
      this.credentialsRepository.setBucketName(bucketName),
      this.credentialsRepository.setBucketDirectory(bucketDirectory),
    ];

    await Promise.all(promises);
  }
}
