import { createInjectionToken } from '@ab/di-container';
import { StorageAdapter, UploadRequest } from '@/ports/StorageAdapter';

export interface MockStorageAdapter extends StorageAdapter {
  setNextError(error: Error): void;
  getUploadedRequests(): UploadRequest[];
}

export class MockStorageAdapter implements MockStorageAdapter {
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

export const mockStorageAdapterToken = createInjectionToken<MockStorageAdapter>('mockStorageAdapterToken', {
  useClass: MockStorageAdapter,
});
