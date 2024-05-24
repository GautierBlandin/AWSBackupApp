import { register } from '@ab/di-container';
import { fileSystemToken } from '@/ports/FileSystem.token';
import { ExpoFileSystem } from '@/infrastructure/ExpoFileSystem';
import { S3StorageAdapter } from '@/infrastructure/S3StorageAdapter';
import { storageAdapterToken } from '@/ports/StorageAdapter.token';
import { imagePickerToken } from '@/ports/ImagePicker.token';
import { ExpoImagePicker } from '@/infrastructure/ExpoImagePicker';
import { AsyncStorageSettingsRepository } from '@/infrastructure/AsyncStorageSettingsRepository';
import { settingsRepositoryToken } from '@/ports/SettingsRepository.token';

const infrastructureRegistered = {
  loaded: false,
};

export function registerInfrastructure() {
  if (!infrastructureRegistered.loaded) {
    register(fileSystemToken, { useClass: ExpoFileSystem });
    register(storageAdapterToken, { useClass: S3StorageAdapter });
    register(imagePickerToken, { useClass: ExpoImagePicker });
    register(settingsRepositoryToken, { useClass: AsyncStorageSettingsRepository });
  }

  infrastructureRegistered.loaded = true;
}
