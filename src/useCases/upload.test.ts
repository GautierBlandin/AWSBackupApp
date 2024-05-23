import { register, reset } from '@ab/di-container';
import { toByteArray } from 'base64-js';
import { MockCredentialsRepository } from '@/ports/CredentialsRepository.mock';
import { credentialsRepositoryToken } from '@/ports/CredentialsRepository.token';
import { imagePickerToken } from '@/ports/ImagePicker.token';
import { mockImagePickerFactory } from '@/ports/ImagePicker.mock';
import { MockStorageAdapter } from '@/ports/StorageAdapter.mock';
import { MockFileSystem } from '@/ports/FileSystem.mock';
import { storageAdapterToken } from '@/ports/StorageAdapter.token';
import { fileSystemToken } from '@/ports/FileSystem.token';
import { UploadUseCase } from '@/useCases/upload';
import { ImagePickerResult, MediaLibraryPermissionResponse, PermissionStatus } from '@/ports/ImagePicker';

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

  it('should not upload if filename is undefined', async () => {
    const { useCase, storageAdapter, imagePicker } = setup();

    const launchImageLibraryResponse: ImagePickerResult = {
      canceled: false,
      assets: [{ uri: 'image1Uri', fileName: undefined }, { uri: 'image2Uri', fileName: 'image2.jpg' }],
    };
    imagePicker.launchImageLibraryAsync.mockResolvedValue(launchImageLibraryResponse);

    await useCase.handleUpload();

    expect(storageAdapter.getUploadedRequests()).toHaveLength(1);
    expect(storageAdapter.getUploadedRequests()).toMatchObject([{ Key: 'image2.jpg' }]);
  });

  it('should throw if access key is not set', () => {
    const { useCase, credentialsRepository } = setup();
    credentialsRepository.setAWSAccessKeyId(undefined);
    return expect(useCase.handleUpload()).rejects.toThrow('Access Key is missing');
  });

  it('should throw if secret access key is not set', () => {
    const { useCase, credentialsRepository } = setup();
    credentialsRepository.setAWSSecretAccessKey(undefined);
    return expect(useCase.handleUpload()).rejects.toThrow('Secret Access Key is missing');
  });

  it('should throw if region is not set', () => {
    const { useCase, credentialsRepository } = setup();
    credentialsRepository.setAWSRegion(undefined);
    return expect(useCase.handleUpload()).rejects.toThrow('Region is missing');
  });

  it('should throw if bucket name is not set', () => {
    const { useCase, credentialsRepository } = setup();
    credentialsRepository.setBucketName(undefined);
    return expect(useCase.handleUpload()).rejects.toThrow('Bucket Name is missing');
  });
});

const setup = () => {
  reset();

  const credentialsRepository = new MockCredentialsRepository();
  const storageAdapter = new MockStorageAdapter();
  const imagePicker = mockImagePickerFactory();
  const fileSystem = new MockFileSystem();

  register(credentialsRepositoryToken, { useValue: credentialsRepository });
  register(storageAdapterToken, { useValue: storageAdapter });
  register(imagePickerToken, { useValue: imagePicker });
  register(fileSystemToken, { useValue: fileSystem });

  const useCase = new UploadUseCase();

  credentialsRepository.setAWSRegion('us-east-1');
  credentialsRepository.setAWSAccessKeyId('accessKey');
  credentialsRepository.setAWSSecretAccessKey('secretAccess');
  credentialsRepository.setBucketName('bucketName');

  const requestMediaLibraryPermissionResponse: MediaLibraryPermissionResponse = { status: PermissionStatus.GRANTED };
  imagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValue(requestMediaLibraryPermissionResponse);
  const launchImageLibraryResponse: ImagePickerResult = {
    canceled: false,
    assets: [{ uri: 'image1Uri', fileName: 'image1.jpg' }, { uri: 'image2Uri', fileName: 'image2.jpg' }],
  };
  imagePicker.launchImageLibraryAsync.mockResolvedValue(launchImageLibraryResponse);

  fileSystem.setFiles(
    [{ uri: 'image1Uri', content: 'image1Content' },
      { uri: 'image2Uri', content: 'image2Content' }],
  );

  return {
    credentialsRepository,
    storageAdapter,
    imagePicker,
    fileSystem,
    useCase,
  };
};
