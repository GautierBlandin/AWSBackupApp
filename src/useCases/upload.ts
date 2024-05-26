import { inject } from '@ab/di-container';
import { toByteArray } from 'base64-js';
import { settingsRepositoryToken } from '@/ports/SettingsRepository.token';
import { DisplayableError } from '@/errors/DisplayableError';
import { storageAdapterToken } from '@/ports/StorageAdapter.token';
import { imagePickerToken } from '@/ports/ImagePicker.token';
import { fileSystemToken } from '@/ports/FileSystem.token';
import { ImagePickerAsset, MediaTypeOptions } from '@/ports/ImagePicker';
import { EncodingType } from '@/ports/FileSystem';
import { Linking } from 'react-native';
import mime from 'mime';

export interface UploadUseCaseOutput {
  status: 'success' | 'canceled';
  message: string;
}

export interface UploadUseCaseInput {
  progressCallback?: (progress: number) => void;
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
}

export interface AssetWithContent {
  uri: string;
  fileName: string;
  fileInfo: {
    exists: true;
    size: number;
  };
  fileContent: string;
}

export class UploadUseCase {
  private readonly credentialsRepository = inject(settingsRepositoryToken);

  private readonly storageAdapter = inject(storageAdapterToken);

  private readonly ImagePicker = inject(imagePickerToken);

  private readonly FileSystem = inject(fileSystemToken);

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
      await this.uploadUserSelectedAssets(userSelectedAssetsResult.assets, input);
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
    const { status } = await this.ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      await Linking.openSettings();

      throw new DisplayableError(
        'You need to grant permission to access the media library in order to upload images.',
        'Permission Denied',
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

  private async uploadUserSelectedAssets(assets: ImagePickerAsset[], options?: UploadUseCaseInput) {
    const { progressCallback, onUploadStart, onUploadEnd } = options || {};

    if (onUploadStart) {
      onUploadStart();
    }

    const assetsWithContent = await this.assetsToAssetsWithContent(assets);

    progressCallback?.(20);

    const uploadProgressArray = assetsWithContent.map((asset) => ({
      loaded: 0,
      total: asset.fileInfo.size,
    }));

    const uploadProgressObject = {
      uploadProgressArray,
      totalLoaded: 0,
      totalTotal: assetsWithContent.reduce((total, asset) => total + asset.fileInfo.size, 0),
    };

    const promises = assetsWithContent.map(async (asset, index) => {
      const uint8Array = toByteArray(asset.fileContent);

      const Key = await this.addBucketDirectoryPrefix(asset.fileName);

      const params = {
        Key,
        Body: uint8Array,
        ContentType: mime.getType(asset.fileName) || 'application/octet-stream',
      };

      return this.storageAdapter.upload(params, {
        progressCallback: (progress) => {
          uploadProgressObject.totalLoaded += progress.loaded - uploadProgressArray[index].loaded;
          uploadProgressArray[index].loaded = progress.loaded;
          progressCallback?.(35 + Math.round((uploadProgressObject.totalLoaded / uploadProgressObject.totalTotal) * 65));
        },
      });
    });

    progressCallback?.(35);

    await Promise.all(promises);

    if (onUploadEnd) {
      onUploadEnd();
    }
  }

  private async addBucketDirectoryPrefix(filename: string): Promise<string> {
    const bucketDirectory = await this.credentialsRepository.getBucketDirectory();

    if (bucketDirectory) {
      return `${bucketDirectory}/${filename}`;
    }

    return filename;
  }

  private async assetsToAssetsWithContent(assets: ImagePickerAsset[]): Promise<AssetWithContent[]> {
    const assetsWithFileInfo = await Promise.all((assets).map(async (asset) => {
      const fileUri = asset.uri;

      const { fileName } = asset;

      if (!fileName) {
        return undefined;
      }

      const fileInfo = await this.FileSystem.getInfoAsync(fileUri);

      if (!fileInfo.exists) {
        return undefined;
      }

      return {
        ...asset,
        fileInfo,
      };
    }));

    const assetsWithContent = await Promise.all(assetsWithFileInfo.map(async (asset) => {
      if (!asset) {
        return undefined;
      }

      const { uri } = asset;

      const fileContent = await this.FileSystem.readAsStringAsync(uri, {
        encoding: EncodingType.Base64,
      });

      return {
        ...asset,
        fileContent,
      };
    }));

    return assetsWithContent.filter((asset): asset is AssetWithContent => asset !== undefined);
  }
}

export class MissingCredentialsError extends DisplayableError {
  constructor(message: string) {
    super(message, 'Missing Credentials');
  }
}
