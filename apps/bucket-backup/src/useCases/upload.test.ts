import { register, reset } from '@bucket-backup/di-container';
import { toByteArray } from 'base64-js';
import { MockSettingsRepository } from '../ports/SettingsRepository.mock';
import { settingsRepositoryToken } from '../ports/SettingsRepository.token';
import { imagePickerToken } from '../ports/ImagePicker.token';
import { mockImagePickerFactory } from '../ports/ImagePicker.mock';
import { MockStorageAdapterImpl } from '../ports/StorageAdapter.mock';
import { MockFileSystem } from '../ports/FileSystem.mock';
import { storageAdapterToken } from '../ports/StorageAdapter.token';
import { fileSystemToken } from '../ports/FileSystem.token';
import { UploadUseCase } from './upload';
import { ImagePickerResult, PermissionStatus } from '../ports/ImagePicker';
import { mockMediaLibraryFactory } from '../ports/MediaLibrary.mock';
import { mediaLibraryToken } from '../ports/MediaLibraryToken';
import { PermissionResponse } from '../ports/MediaLibrary';
import { UploadServiceImpl, uploadServiceToken } from '../services/UploadService';

describe('upload', () => {
  it('should handle upload', async () => {
    const { useCase, storageAdapter } = setup();

    await useCase.handleUpload();

    expect(storageAdapter.getUploadedRequests()).toMatchObject([
      {
        Key: 'image1.jpg',
        Body: toByteArray(Buffer.from('image1Content').toString('base64')),
      },
      { Key: 'image2.jpg' },
    ]);
  });

  it('should add prefix to filename', async () => {
    const { useCase, storageAdapter, settingsRepository } = setup();
    settingsRepository.setBucketDirectory('pixel8');

    await useCase.handleUpload();

    expect(storageAdapter.getUploadedRequests()).toMatchObject([
      {
        Key: 'pixel8/image1.jpg',
      },
      { Key: 'pixel8/image2.jpg' },
    ]);
  });

  describe('upload callback', () => {
    it('should call onUploadStart and onUploadEnd', async () => {
      const { useCase } = setup();
      const onUploadStart = jest.fn();
      const onUploadEnd = jest.fn();

      await useCase.handleUpload({ onUploadStart, onUploadEnd });

      expect(onUploadStart).toHaveBeenCalledTimes(1);
      expect(onUploadEnd).toHaveBeenCalledTimes(1);
    });

    it('should call progressCallback', async () => {
      const { useCase } = setup();
      const progressCallback = jest.fn();

      await useCase.handleUpload({ progressCallback });

      expect(progressCallback).toHaveBeenCalledTimes(3);
      expect(progressCallback).toHaveBeenNthCalledWith(1, 0);
      expect(progressCallback).toHaveBeenNthCalledWith(2, 50);
      expect(progressCallback).toHaveBeenNthCalledWith(3, 100);
    });
  });

  it('should not upload if filename is undefined', async () => {
    const { useCase, storageAdapter, imagePicker } = setup();

    const launchImageLibraryResponse: ImagePickerResult = {
      canceled: false,
      assets: [
        { uri: 'image1Uri', fileName: undefined },
        { uri: 'image2Uri', fileName: 'image2.jpg' },
      ],
    };
    imagePicker.launchImageLibraryAsync.mockResolvedValue(launchImageLibraryResponse);

    await useCase.handleUpload();

    expect(storageAdapter.getUploadedRequests()).toHaveLength(1);
    expect(storageAdapter.getUploadedRequests()).toMatchObject([{ Key: 'image2.jpg' }]);
  });

  it('should throw if access key is not set', () => {
    const { useCase, settingsRepository } = setup();
    settingsRepository.setAWSAccessKeyId(undefined);
    return expect(useCase.handleUpload()).rejects.toThrow('Access Key is missing');
  });

  it('should throw if secret access key is not set', () => {
    const { useCase, settingsRepository } = setup();
    settingsRepository.setAWSSecretAccessKey(undefined);
    return expect(useCase.handleUpload()).rejects.toThrow('Secret Access Key is missing');
  });

  it('should throw if region is not set', () => {
    const { useCase, settingsRepository } = setup();
    settingsRepository.setAWSRegion(undefined);
    return expect(useCase.handleUpload()).rejects.toThrow('Region is missing');
  });

  it('should throw if bucket name is not set', () => {
    const { useCase, settingsRepository } = setup();
    settingsRepository.setBucketName(undefined);
    return expect(useCase.handleUpload()).rejects.toThrow('Bucket Name is missing');
  });
});

const setup = () => {
  reset();

  const settingsRepository = new MockSettingsRepository();
  const storageAdapter = new MockStorageAdapterImpl();
  const imagePicker = mockImagePickerFactory();
  const fileSystem = new MockFileSystem();
  const mediaLibrary = mockMediaLibraryFactory();

  register(settingsRepositoryToken, { useValue: settingsRepository });
  register(storageAdapterToken, { useValue: storageAdapter });
  register(imagePickerToken, { useValue: imagePicker });
  register(fileSystemToken, { useValue: fileSystem });
  register(mediaLibraryToken, { useValue: mediaLibrary });
  register(uploadServiceToken, { useClass: UploadServiceImpl });

  const useCase = new UploadUseCase();

  settingsRepository.setAWSRegion('us-east-1');
  settingsRepository.setAWSAccessKeyId('accessKey');
  settingsRepository.setAWSSecretAccessKey('secretAccess');
  settingsRepository.setBucketName('bucketName');

  const requestMediaLibraryPermissionResponse: PermissionResponse = { status: PermissionStatus.GRANTED };
  mediaLibrary.getPermissionsAsync.mockResolvedValue(requestMediaLibraryPermissionResponse);

  const launchImageLibraryResponse: ImagePickerResult = {
    canceled: false,
    assets: [
      { uri: 'image1Uri', fileName: 'image1.jpg' },
      { uri: 'image2Uri', fileName: 'image2.jpg' },
    ],
  };
  imagePicker.launchImageLibraryAsync.mockResolvedValue(launchImageLibraryResponse);

  fileSystem.setFiles([
    { uri: 'image1Uri', content: 'image1Content' },
    { uri: 'image2Uri', content: 'image2Content' },
  ]);

  return {
    settingsRepository,
    storageAdapter,
    imagePicker,
    fileSystem,
    useCase,
  };
};
