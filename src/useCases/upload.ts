import { inject } from '@ab/di-container';
import { toByteArray } from 'base64-js';
import { settingsRepositoryToken } from '@/ports/SettingsRepository.token';
import { DisplayableError } from '@/errors/DisplayableError';
import { storageAdapterToken } from '@/ports/StorageAdapter.token';
import { imagePickerToken } from '@/ports/ImagePicker.token';
import { fileSystemToken } from '@/ports/FileSystem.token';
import { ImagePickerAsset, MediaTypeOptions } from '@/ports/ImagePicker';
import { EncodingType } from '@/ports/FileSystem';
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

    onUploadStart?.();
    progressCallback?.(0);

    let processedAssets = 0;
    let assetToProcessPointer = 0;
    const batchSize = 5;
    let activeSlots = 0;

    const processAssets = async () => {
      while (processedAssets < assets.length) {
        if (activeSlots < batchSize && assetToProcessPointer < assets.length) {
          activeSlots += 1;
          const asset = assets[assetToProcessPointer];
          assetToProcessPointer += 1;
          // eslint-disable-next-line @typescript-eslint/no-loop-func
          this.processAsset(asset).finally(() => {
            processedAssets += 1;
            progressCallback?.(Math.round((processedAssets / assets.length) * 100));
            activeSlots -= 1;
          });
        } else {
          // eslint-disable-next-line no-await-in-loop
          await new Promise((resolve) => { setTimeout(resolve, 100); });
        }
      }
    };

    await processAssets();

    onUploadEnd?.();
  }

  private async processAsset(asset: ImagePickerAsset) {
    const assetWithContent = await this.assetToAssetWithContent(asset);

    if (!assetWithContent) {
      return;
    }

    const uint8Array = toByteArray(assetWithContent.fileContent);
    const Key = await this.addBucketDirectoryPrefix(assetWithContent.fileName);

    const params = {
      Key,
      Body: uint8Array,
      ContentType: mime.getType(assetWithContent.fileName) || 'application/octet-stream',
    };

    try {
      await this.storageAdapter.upload(params);
    } catch (error) {
      throw new DisplayableError('An error occurred while uploading the images.', 'Upload Error');
    }
  }

  private async addBucketDirectoryPrefix(filename: string): Promise<string> {
    const bucketDirectory = await this.credentialsRepository.getBucketDirectory();

    if (bucketDirectory) {
      return `${bucketDirectory}/${filename}`;
    }

    return filename;
  }

  private async assetToAssetWithContent(asset: ImagePickerAsset): Promise<AssetWithContent | undefined> {
    const { uri, fileName } = asset;

    if (!fileName) {
      return undefined;
    }

    const fileInfo = await this.FileSystem.getInfoAsync(uri);

    if (!fileInfo.exists) {
      return undefined;
    }

    const fileContent = await this.FileSystem.readAsStringAsync(uri, {
      encoding: EncodingType.Base64,
    });

    return {
      ...asset,
      fileName,
      fileInfo: { exists: true },
      fileContent,
    };
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
