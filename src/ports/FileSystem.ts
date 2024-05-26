export interface FileSystem {
  getInfoAsync: (fileUri: string) => Promise<GetInfoResponse>;
  readAsStringAsync: (fileUri: string, options: ReadAsStringAsyncOptions) => Promise<string>;
}

export type GetInfoResponse = {
  exists: boolean;
};

export type ReadAsStringAsyncOptions = {
  encoding: EncodingType;
};

export enum EncodingType {
  /**
   * Standard encoding format.
   */
  UTF8 = 'utf8',
  /**
   * Binary, radix-64 representation.
   */
  Base64 = 'base64',
}
