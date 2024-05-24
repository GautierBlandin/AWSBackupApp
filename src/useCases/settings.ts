import { inject } from '@ab/di-container';
import { settingsRepositoryToken } from '@/ports/SettingsRepository.token';

interface Credentials {
  accessKey: string | undefined;
  secretAccessKey: string | undefined;
  region: string | undefined;
  bucketName: string | undefined;

}

export class SettingsUseCase {
  private readonly credentialsRepository = inject(settingsRepositoryToken);

  private credentials: Credentials = {
    accessKey: undefined,
    secretAccessKey: undefined,
    region: undefined,
    bucketName: undefined,
  };

  public async loadCredentials() {
    const promises = [
      this.credentialsRepository.getAWSAccessKeyId(),
      this.credentialsRepository.getAWSSecretAccessKey(),
      this.credentialsRepository.getAWSRegion(),
      this.credentialsRepository.getBucketName(),
    ];

    const [existingAccessKey, existingSecretAccessKey, existingRegion, existingBucketName] = await Promise.all(promises);

    this.credentials = {
      accessKey: existingAccessKey,
      secretAccessKey: existingSecretAccessKey,
      region: existingRegion,
      bucketName: existingBucketName,
    };

    return {
      accessKey: existingAccessKey,
      secretAccessKey: existingSecretAccessKey,
      region: existingRegion,
      bucketName: existingBucketName,
    };
  }

  public async saveCredentials({
    accessKey,
    secretAccessKey,
    region,
    bucketName,
  }: Credentials) {
    this.credentials = {
      accessKey,
      secretAccessKey,
      region,
      bucketName,
    };

    const promises = [
      this.credentialsRepository.setAWSAccessKeyId(accessKey),
      this.credentialsRepository.setAWSSecretAccessKey(secretAccessKey),
      this.credentialsRepository.setAWSRegion(region),
      this.credentialsRepository.setBucketName(bucketName),
    ];

    await Promise.all(promises);
  }
}
