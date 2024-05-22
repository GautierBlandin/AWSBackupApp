export interface StorageAdapter {
  upload(uploadRequest: UploadRequest): Promise<void>;
}

export interface UploadRequest {
  Key: string;
  Body: Uint8Array;
  ContentType: string;
}
