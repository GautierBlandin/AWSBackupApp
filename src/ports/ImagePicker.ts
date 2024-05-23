export interface ImagePicker {
  getMediaLibraryPermissionsAsync: () => Promise<MediaLibraryPermissionResponse>;
  launchImageLibraryAsync: (options: ImagePickerOptions) => Promise<ImagePickerResult>;
}

export enum MediaTypeOptions {
  /**
   * Images and videos.
   */
  All = 'All',
  /**
   * Only videos.
   */
  Videos = 'Videos',
  /**
   * Only images.
   */
  Images = 'Images',
}

export type ImagePickerOptions = {
  mediaTypes?: MediaTypeOptions;
  quality?: number;
  allowsMultipleSelection?: boolean;
};

export type MediaLibraryPermissionResponse = {
  status: PermissionStatus;
};

export type ImagePickerResult = ImagePickerSuccessResult | ImagePickerErrorResult;

export type ImagePickerSuccessResult = {
  cancelled: false;
  assets: ImagePickerAsset[];
};

export type ImagePickerErrorResult = {
  cancelled: true;
  assets: null;
};

export type ImagePickerAsset = {
  uri: string;
  filename: string | null | undefined;
};

export enum PermissionStatus {
  /**
   * User has granted the permission.
   */
  GRANTED = 'granted',
  /**
   * User hasn't granted or denied the permission yet.
   */
  UNDETERMINED = 'undetermined',
  /**
   * User has denied the permission.
   */
  DENIED = 'denied',
}
