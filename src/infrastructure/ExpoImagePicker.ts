import * as ExpoImagePickerImport from 'expo-image-picker';
import {
  ImagePicker,
  ImagePickerAsset,
  ImagePickerOptions,
  ImagePickerResult,
  MediaLibraryPermissionResponse,
} from '@/ports/ImagePicker';

export class ExpoImagePicker implements ImagePicker {
  async requestMediaLibraryPermissionsAsync(): Promise<MediaLibraryPermissionResponse> {
    const { status } = await ExpoImagePickerImport.getMediaLibraryPermissionsAsync();

    return {
      status,
    };
  }

  async launchImageLibraryAsync(options: ImagePickerOptions): Promise<ImagePickerResult> {
    const result = await ExpoImagePickerImport.launchImageLibraryAsync({
      mediaTypes: options.mediaTypes || ExpoImagePickerImport.MediaTypeOptions.All,
      quality: options.quality || 1,
      allowsMultipleSelection: options.allowsMultipleSelection || false,
    });

    if (result.canceled) {
      return {
        canceled: true,
        assets: null,
      };
    }
    const assets: ImagePickerAsset[] = result.assets.map((asset) => ({
      uri: asset.uri,
      fileName: asset.fileName,
    }));

    return {
      canceled: false,
      assets,
    };
  }
}
