import { createInjectionToken } from '@bucket-backup/di-container';
import { StorageAdapter, UploadRequest } from './StorageAdapter';

export interface MockStorageAdapter extends StorageAdapter {
  setNextError(error: Error): void;
  getUploadedRequests(): UploadRequest[];
}

export class MockStorageAdapterImpl implements MockStorageAdapter {
  private nextError: Error | null = null;

  private uploadedRequests: UploadRequest[] = [];

  async upload(uploadRequest: UploadRequest): Promise<void> {
    if (this.nextError) {
      const error = this.nextError;
      this.nextError = null;
      throw error;
    }
    // Storing the uploaded request
    this.uploadedRequests.push(uploadRequest);
  }

  setNextError(error: Error): void {
    this.nextError = error;
  }

  getUploadedRequests(): UploadRequest[] {
    return this.uploadedRequests;
  }
}

export const mockStorageAdapterToken = createInjectionToken<MockStorageAdapterImpl>('mockStorageAdapterToken', {
  useClass: MockStorageAdapterImpl,
});
