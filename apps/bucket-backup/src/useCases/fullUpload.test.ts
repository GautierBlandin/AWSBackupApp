import { register, reset } from '@bucket-backup/di-container';
import { MockBackupDateRepository } from '../ports/BackupDateRepository.mock';
import { mockMediaLibraryFactory } from '../ports/MediaLibrary.mock';
import { mockUploadServiceFactory } from '../services/UploadService.mock';
import { backupDateRepositoryToken } from '../ports/BackupDateRepository.token';
import { mediaLibraryToken } from '../ports/MediaLibraryToken';
import { uploadServiceToken } from '../services/UploadService';
import { MissingPermissionsError, FullUploadUseCase } from './fullUpload';
import { dateServiceToken, MockDateService } from '../services/DateService';
import { PermissionStatus } from '../ports/MediaLibrary';

describe('FullUploadUseCase', () => {
  it('should upload all assets from media library', async () => {
    const { useCase, uploadService } = setup();

    const options = {
      onUploadStart: jest.fn(),
      onUploadEnd: jest.fn(),
      progressCallback: jest.fn(),
    };

    await useCase.backupNewMedia(options);

    expect(options.onUploadStart).toHaveBeenCalledTimes(1);

    expect(uploadService.upload).toHaveBeenCalledTimes(1);
    expect(uploadService.upload).toHaveBeenCalledWith(
      [
        {
          uri: 'fake-uri1',
          fileName: 'fake-filename1',
        },
        {
          uri: 'fake-uri2',
          fileName: 'fake-filename2',
        },
        {
          uri: 'fake-uri3',
          fileName: 'fake-filename3',
        },
        {
          uri: 'fake-uri4',
          fileName: 'fake-filename4',
        },
      ],
      expect.objectContaining({
        onUploadEnd: options.onUploadEnd,
        progressCallback: options.progressCallback,
      })
    );
  });

  it('should set backup date after uploading all assets', async () => {
    const { useCase, backupDateRepository, dateService } = setup();

    dateService.setCurrentDate(new Date(2021, 1, 1));

    await useCase.backupNewMedia({});

    expect(await backupDateRepository.getBackupDate()).toEqual(new Date(2021, 1, 1));
  });

  it('should call media library with createdAfter when last backup date is set', async () => {
    const { useCase, backupDateRepository, mediaLibrary } = setup();

    await backupDateRepository.setBackupDate(new Date(2021, 1, 1));

    await useCase.backupNewMedia({});

    expect(mediaLibrary.getAssetsAsync).toHaveBeenCalledWith({
      createdAfter: new Date(2021, 1, 1).getTime(),
    });
  });

  it('should call media library without createdAfter when last backup date is not set', async () => {
    const { useCase, mediaLibrary } = setup();

    await useCase.backupNewMedia({});

    expect(mediaLibrary.getAssetsAsync).toHaveBeenCalledWith();
  });

  it('should throw MissingPermissionsError when permissions are not granted', async () => {
    const { useCase, mediaLibrary } = setup();

    mediaLibrary.requestPermissionsAsync.mockResolvedValue({ status: PermissionStatus.DENIED });

    await expect(useCase.backupNewMedia({})).rejects.toThrow(MissingPermissionsError);
  });
});

const setup = () => {
  reset();

  const backupDateRepository = new MockBackupDateRepository();
  const mediaLibrary = mockMediaLibraryFactory();
  const uploadService = mockUploadServiceFactory();
  const dateService = new MockDateService();

  register(backupDateRepositoryToken, { useValue: backupDateRepository });
  register(mediaLibraryToken, { useValue: mediaLibrary });
  register(uploadServiceToken, { useValue: uploadService });
  register(dateServiceToken, { useValue: dateService });

  mediaLibrary.getAssetsAsync.mockImplementationOnce(async () => {
    return {
      assets: [
        {
          uri: 'fake-uri1',
          filename: 'fake-filename1',
        },
        {
          uri: 'fake-uri2',
          filename: 'fake-filename2',
        },
        {
          uri: 'fake-uri3',
          filename: 'fake-filename3',
        },
      ],
      endCursor: 'fake-uri3',
      hasNextPage: true,
      totalCount: 4,
    };
  });

  mediaLibrary.getAssetsAsync.mockImplementationOnce(async () => {
    return {
      assets: [
        {
          uri: 'fake-uri4',
          filename: 'fake-filename4',
        },
      ],
      endCursor: 'fake-uri4',
      hasNextPage: false,
      totalCount: 4,
    };
  });

  const useCase = new FullUploadUseCase();

  return {
    useCase,
    backupDateRepository,
    mediaLibrary,
    uploadService,
    dateService,
  };
};
