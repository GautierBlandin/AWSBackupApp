import { inject } from '@bucket-backup/di-container';
import { settingsRepositoryToken } from '../ports/SettingsRepository.token';
import { DisplayableError } from '../errors/DisplayableError';
import { imagePickerToken } from '../ports/ImagePicker.token';
import { MediaTypeOptions } from '../ports/ImagePicker';
import { uploadServiceToken } from '../services/UploadService';
import { mediaLibraryToken } from '../ports/MediaLibraryToken';

export interface UploadUseCaseOutput {
  status: 'success' | 'canceled';
  message: string;
}

export interface UploadUseCaseInput {
  progressCallback?: (progress: number) => void;
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
}

export class UploadUseCase {
  private readonly credentialsRepository = inject(settingsRepositoryToken);

  private mediaLibrary = inject(mediaLibraryToken);

  private readonly ImagePicker = inject(imagePickerToken);

  private uploadService = inject(uploadServiceToken);

  public async handleUpload(input?: UploadUseCaseInput): Promise<UploadUseCaseOutput> {
    await this.checkCredentials();
    await this.checkAppPermissions();

    const userSelectedAssetsResult = await this.requestUserSelection();

    if (userSelectedAssetsResult.canceled) {
      return {
        status: 'canceled',
        message: 'Upload canceled',
      };
    }

    try {
      await this.uploadService.upload(userSelectedAssetsResult.assets, input);
    } catch (error) {
      throw new DisplayableError('An error occurred while uploading the images.', 'Upload Error');
    }

    return {
      status: 'success',
      message: 'Upload successful',
    };
  }

  private async checkCredentials() {
    const accessKey = await this.credentialsRepository.getAWSAccessKeyId();
    const secretAccessKey = await this.credentialsRepository.getAWSSecretAccessKey();
    const region = await this.credentialsRepository.getAWSRegion();
    const bucketName = await this.credentialsRepository.getBucketName();

    if (!accessKey) throw new MissingCredentialsError('Access Key is missing');
    if (!secretAccessKey) throw new MissingCredentialsError('Secret Access Key is missing');
    if (!region) throw new MissingCredentialsError('Region is missing');
    if (!bucketName) throw new MissingCredentialsError('Bucket Name is missing');
  }

  private async checkAppPermissions() {
    const { status } = await this.mediaLibrary.getPermissionsAsync();
    if (status !== 'granted') {
      throw new DisplayableError(
        'You need to grant permission to access the media library in order to upload images.',
        'Permission Denied'
      );
    }
  }

  private async requestUserSelection() {
    return this.ImagePicker.launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      quality: 1,
      allowsMultipleSelection: true,
    });
  }
}

export class MissingCredentialsError extends DisplayableError {
  constructor(message: string) {
    super(message, 'Missing Credentials');
  }
}
