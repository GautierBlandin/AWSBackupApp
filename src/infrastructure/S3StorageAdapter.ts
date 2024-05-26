import AWS from 'aws-sdk';
import { inject } from '@ab/di-container';
import { UploadRequest, UploadRequestOptions } from '@/ports/StorageAdapter';
import { settingsRepositoryToken } from '@/ports/SettingsRepository.token';

export class S3StorageAdapter {
  private readonly credentialsRepository = inject(settingsRepositoryToken);

  public async upload(uploadRequest: UploadRequest, options?: UploadRequestOptions): Promise<void> {
    const { progressCallback } = options || {};

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

    const managedUpload = s3.upload(params);

    managedUpload.on('httpUploadProgress', (progress) => {
      if (progressCallback) {
        progressCallback(progress);
      }
    });

    await managedUpload.promise();
  }
}

export class MissingCredentialsError extends Error {
  constructor() {
    super('Please save your AWS credentials in the settings screen before uploading images.');
  }
}
