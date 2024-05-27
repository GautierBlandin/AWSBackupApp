export interface MediaLibrary {
  getAssetsAsync(assetsOptions?: AssetsOptions): Promise<PagedInfo<Asset>>;
  getPermissionsAsync(): Promise<PermissionResponse>;
  requestPermissionsAsync(): Promise<PermissionResponse>;
}

export type PagedInfo<T> = {
  /**
   * A page of [`Asset`](#asset)s fetched by the query.
   */
  assets: T[];
  /**
   * ID of the last fetched asset. It should be passed as `after` option in order to get the
   * next page.
   */
  endCursor: string;
  /**
   * Whether there are more assets to fetch.
   */
  hasNextPage: boolean;
  /**
   * Estimated total number of assets that match the query.
   */
  totalCount: number;
};

export type AssetsOptions = {
  /**
   * `Date` object or Unix timestamp in milliseconds limiting returned assets only to those that
   * were created after this date.
   */
  createdAfter?: Date | number;
  after?: AssetRef;
};

export type Asset = {
  uri: string;
  filename: string;
};

export type PermissionResponse = {
  accessPrivileges?: 'all' | 'limited' | 'none';
  status: PermissionStatus;
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

export type AssetRef = string;
