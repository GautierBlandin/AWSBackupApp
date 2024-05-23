import { register } from '@ab/di-container';
import { fileSystemToken } from '@/ports/FileSystem.token';
import { ExpoFileSystem } from '@/infrastructure/ExpoFileSystem';
import { S3StorageAdapter } from '@/infrastructure/S3StorageAdapter';
import { storageAdapterToken } from '@/ports/StorageAdapter.token';
import { imagePickerToken } from '@/ports/ImagePicker.token';
import { ExpoImagePicker } from '@/infrastructure/ExpoImagePicker';
import { AsyncStorageCredentialsRepository } from '@/infrastructure/AsyncStorageCredentialsRepository';
import { credentialsRepositoryToken } from '@/ports/CredentialsRepository.token';

const infrastructureRegistered = {
  loaded: false,
};

export function registerInfrastructure() {
  if (!infrastructureRegistered.loaded) {
    register(fileSystemToken, { useClass: ExpoFileSystem });
    register(storageAdapterToken, { useClass: S3StorageAdapter });
    register(imagePickerToken, { useClass: ExpoImagePicker });
    register(credentialsRepositoryToken, { useClass: AsyncStorageCredentialsRepository });
  }

  infrastructureRegistered.loaded = true;
}
