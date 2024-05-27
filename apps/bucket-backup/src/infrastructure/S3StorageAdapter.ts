import AWS from 'aws-sdk';
import { inject } from '@bucket-backup/di-container';
import { UploadRequest } from '../ports/StorageAdapter';
import { settingsRepositoryToken } from '../ports/SettingsRepository.token';

export class S3StorageAdapter {
  private readonly credentialsRepository = inject(settingsRepositoryToken);

  public async upload(uploadRequest: UploadRequest): Promise<void> {
    const region = await this.credentialsRepository.getAWSRegion();
    const awsAccessKeyId = await this.credentialsRepository.getAWSAccessKeyId();
    const awsSecretAccessKey = await this.credentialsRepository.getAWSSecretAccessKey();
    const bucketName = await this.credentialsRepository.getBucketName();

    if (!region || !awsAccessKeyId || !awsSecretAccessKey || !bucketName) {
      throw new MissingCredentialsError();
    }

    const credentials = new AWS.Credentials({
      accessKeyId: awsAccessKeyId,
      secretAccessKey: awsSecretAccessKey,
    });

    AWS.config.update({
      credentials,
      region,
    });

    const params = {
      Bucket: bucketName,
      Key: uploadRequest.Key,
      Body: uploadRequest.Body,
    };

    const s3 = new AWS.S3();

    await s3.upload(params).promise();
  }
}

export class MissingCredentialsError extends Error {
  constructor() {
    super('Please save your AWS credentials in the settings screen before uploading images.');
  }
}
