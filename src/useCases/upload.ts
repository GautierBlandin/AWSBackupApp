import { inject } from '@ab/di-container';
import { credentialsRepositoryToken } from '@/ports/CredentialsRepository.token';
import { DisplayableError } from '@/errors/DisplayableError';
import { storageAdapterToken } from '@/ports/StorageAdapter.token';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { toByteArray } from 'base64-js';

export interface UploadUseCaseOutput {
  status: 'success';
  message: string;
}

export class UploadUseCase {
  private readonly credentialsRepository = inject(credentialsRepositoryToken);

  private readonly storageAdapter = inject(storageAdapterToken);

  public async handleUpload(): Promise<UploadUseCaseOutput> {
    await this.checkCredentials();
    await this.checkAppPermissions();

    const userSelectedAssetsResult = await this.requestUserSelection();

    if (!userSelectedAssetsResult.canceled) {
      try {
        const uploadPromises = this.uploadUserSelectedAssets(userSelectedAssetsResult.assets);
        await Promise.all(uploadPromises);
      } catch (error) {
        throw new DisplayableError('An error occurred while uploading the images.', 'Upload Error');
      }
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
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      throw new DisplayableError(
        'You need to grant permission to access the media library in order to upload images.',
        'Permission Denied',
      );
    }
  }

  private async requestUserSelection() {
    return ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsMultipleSelection: true,
    });
  }

  private uploadUserSelectedAssets(assets: ImagePicker.ImagePickerAsset[]) {
    return assets.map(async (asset) => {
      const fileUri = asset.uri;
      const fileInfo = await FileSystem.getInfoAsync(fileUri);

      if (!fileInfo.exists) {
        return undefined;
      }

      const fileContent = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const uint8Array = toByteArray(fileContent);

      const params = {
        Key: asset.fileName || 'image.jpg',
        Body: uint8Array,
        ContentType: 'image/jpeg',
      };

      return this.storageAdapter.upload(params);
    });
  }
}

export class MissingCredentialsError extends DisplayableError {
  constructor(message: string) {
    super(message, 'Missing Credentials');
  }
}
