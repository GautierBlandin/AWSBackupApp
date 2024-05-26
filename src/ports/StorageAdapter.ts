export interface StorageAdapter {
  upload(uploadRequest: UploadRequest, options?: UploadRequestOptions): Promise<void>;
}

export interface UploadRequestOptions {
  progressCallback?: (progress: Progress) => void;
}

export interface Progress {
  loaded: number;
  total: number;
}

export interface UploadRequest {
  Key: string;
  Body: Uint8Array;
  ContentType: string;
}
