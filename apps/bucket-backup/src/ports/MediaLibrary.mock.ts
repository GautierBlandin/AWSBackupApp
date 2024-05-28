import { Asset, AssetsOptions, PagedInfo, PermissionResponse, PermissionStatus } from './MediaLibrary';

export const mockMediaLibraryFactory = () => ({
  getAssetsAsync: jest.fn<Promise<PagedInfo<Asset>>, [AssetsOptions | undefined]>(),
  getPermissionsAsync: jest.fn().mockResolvedValue({ status: PermissionStatus.GRANTED } satisfies PermissionResponse),
  requestPermissionsAsync: jest
    .fn()
    .mockResolvedValue({ status: PermissionStatus.GRANTED } satisfies PermissionResponse),
});
