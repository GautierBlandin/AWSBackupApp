import { register } from '@bucket-backup/di-container';
import { fileSystemToken } from './ports/FileSystem.token';
import { ExpoFileSystem } from './infrastructure/ExpoFileSystem';
import { S3StorageAdapter } from './infrastructure/S3StorageAdapter';
import { storageAdapterToken } from './ports/StorageAdapter.token';
import { imagePickerToken } from './ports/ImagePicker.token';
import { ExpoImagePicker } from './infrastructure/ExpoImagePicker';
import { AsyncStorageSettingsRepository } from './infrastructure/AsyncStorageSettingsRepository';
import { settingsRepositoryToken } from './ports/SettingsRepository.token';
import { mediaLibraryToken } from './ports/MediaLibraryToken';
import { ExpoMediaLibrary } from './infrastructure/ExpoMediaLibrary';
import { backupDateRepositoryToken } from './ports/BackupDateRepository.token';
import { AsyncStorageBackupDateRepository } from './infrastructure/AsyncStorageBackupDateRepository';

export function registerApp() {
  register(fileSystemToken, { useClass: ExpoFileSystem });
  register(storageAdapterToken, { useClass: S3StorageAdapter });
  register(imagePickerToken, { useClass: ExpoImagePicker });
  register(settingsRepositoryToken, { useClass: AsyncStorageSettingsRepository });
  register(mediaLibraryToken, { useClass: ExpoMediaLibrary });
  register(backupDateRepositoryToken, { useClass: AsyncStorageBackupDateRepository });
}
