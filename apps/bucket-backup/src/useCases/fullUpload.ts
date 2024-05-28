import { inject } from '@bucket-backup/di-container';
import { backupDateRepositoryToken } from '../ports/BackupDateRepository.token';
import { mediaLibraryToken } from '../ports/MediaLibraryToken';
import { PagedInfo } from 'expo-media-library';
import { Asset, PermissionStatus } from '../ports/MediaLibrary';
import { UploadServiceOptions, uploadServiceToken } from '../services/UploadService';
import { dateServiceToken } from '../services/DateService';

export class FullUploadUseCase {
  private readonly backupDateRepository = inject(backupDateRepositoryToken);

  private readonly mediaLibrary = inject(mediaLibraryToken);

  private uploadService = inject(uploadServiceToken);

  private dateService = inject(dateServiceToken);

  public async backupNewMedia(options: UploadServiceOptions): Promise<void> {
    const startBackupDate = this.dateService.now();

    const permissions = await this.mediaLibrary.requestPermissionsAsync();

    if (!(permissions.status === PermissionStatus.GRANTED)) {
      throw new MissingPermissionsError();
    }

    options.onUploadStart?.();

    const assetsArray: Asset[] = [];
    let assets = await this.getAssetsToBackup();

    while (assets.hasNextPage) {
      assetsArray.push(...assets.assets);
      assets = await this.getAssetsToBackup({
        after: assets.endCursor,
      });
    }

    assetsArray.push(...assets.assets);

    await this.uploadService.upload(
      assetsArray.map((asset) => ({
        uri: asset.uri,
        fileName: asset.filename,
      })),
      {
        onUploadEnd: options.onUploadEnd,
        progressCallback: options.progressCallback,
      }
    );

    await this.backupDateRepository.setBackupDate(startBackupDate);
  }

  private async getAssetsToBackup(args?: { after?: string }): Promise<PagedInfo<Asset>> {
    const lastBackupDate = await this.backupDateRepository.getBackupDate();

    if (!lastBackupDate) {
      return this.mediaLibrary.getAssetsAsync({
        after: args?.after,
      });
    }

    return this.mediaLibrary.getAssetsAsync({
      createdAfter: lastBackupDate.getTime(),
      after: args?.after,
    });
  }
}

export class MissingPermissionsError extends Error {
  constructor() {
    super('Permission to access media library is required');
  }
}
