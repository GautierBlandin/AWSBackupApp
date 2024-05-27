import { ImagePickerAsset } from '../ports/ImagePicker';
import { toByteArray } from 'base64-js';
import { DisplayableError } from '../errors/DisplayableError';
import { EncodingType } from '../ports/FileSystem';
import { inject } from '@bucket-backup/di-container';
import { settingsRepositoryToken } from '../ports/SettingsRepository.token';
import { storageAdapterToken } from '../ports/StorageAdapter.token';
import { fileSystemToken } from '../ports/FileSystem.token';
import mime from 'mime';

export interface UploadServiceOptions {
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

export class UploadService {
  private readonly credentialsRepository = inject(settingsRepositoryToken);

  private readonly storageAdapter = inject(storageAdapterToken);

  private readonly FileSystem = inject(fileSystemToken);

  public async uploadUserSelectedAssets(assets: ImagePickerAsset[], options?: UploadServiceOptions) {
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
          // eslint-disable-next-line @typescript-eslint/no-loop-func, no-loop-func
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
}
