import {
  Asset, AssetsOptions, MediaLibrary as MediaLibraryInterface, PagedInfo,
} from '@/ports/MediaLibrary';
import * as ExpoMediaLibraryImport from 'expo-media-library';

export class ExpoMediaLibrary implements MediaLibraryInterface {
  getAssetsAsync(assetsOptions?: AssetsOptions): Promise<PagedInfo<Asset>> {
    return ExpoMediaLibraryImport.getAssetsAsync(assetsOptions);
  }

  getPermissionsAsync(): Promise<ExpoMediaLibraryImport.PermissionResponse> {
    return ExpoMediaLibraryImport.getPermissionsAsync();
  }

  requestPermissionsAsync(): Promise<ExpoMediaLibraryImport.PermissionResponse> {
    return ExpoMediaLibraryImport.requestPermissionsAsync();
  }
}
