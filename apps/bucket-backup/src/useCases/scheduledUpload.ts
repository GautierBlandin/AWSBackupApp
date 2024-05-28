import { inject } from '@bucket-backup/di-container';
import { backupDateRepositoryToken } from '../ports/BackupDateRepository.token';
import { mediaLibraryToken } from '../ports/MediaLibraryToken';
import { PagedInfo } from 'expo-media-library';
import { Asset } from '../ports/MediaLibrary';
import { UploadServiceImpl, UploadServiceOptions } from '../services/UploadService';

import * as ExpoMediaLibraryDirect from 'expo-media-library';

export class ScheduledUploadUseCase {
  private readonly backupDateRepository = inject(backupDateRepositoryToken);

  private readonly mediaLibrary = inject(mediaLibraryToken);

  private uploadService = new UploadServiceImpl();

  public async backupNewMedia(options: UploadServiceOptions): Promise<void> {
    const startBackupDate = new Date();

    const permissions = await ExpoMediaLibraryDirect.requestPermissionsAsync();

    if (!permissions.granted) {
      throw new MissingPermissionsError();
    }

    let assets = await this.getAssetsToBackup();

    while (assets.hasNextPage) {
      // eslint-disable-next-line no-await-in-loop
      await this.uploadService.upload(
        assets.assets.map((asset) => ({
          ...asset,
          fileName: asset.filename,
        })),
        options
      );
      // eslint-disable-next-line no-await-in-loop
      assets = await this.mediaLibrary.getAssetsAsync({
        after: assets.endCursor,
      });
    }

    await this.uploadService.upload(
      assets.assets.map((asset) => ({
        ...asset,
        fileName: asset.filename,
      })),
      options
    );

    await this.backupDateRepository.setBackupDate(startBackupDate);
  }

  private async getAssetsToBackup(): Promise<PagedInfo<Asset>> {
    const lastBackupDate = await this.backupDateRepository.getBackupDate();

    if (!lastBackupDate) {
      return this.mediaLibrary.getAssetsAsync();
    }

    return this.mediaLibrary.getAssetsAsync({
      createdAfter: lastBackupDate.getTime(),
    });
  }
}

export class MissingPermissionsError extends Error {
  constructor() {
    super('Permission to access media library is required');
  }
}
