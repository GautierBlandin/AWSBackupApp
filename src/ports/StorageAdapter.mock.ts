import { createInjectionToken } from '@ab/di-container';
import { StorageAdapter, UploadRequest, UploadRequestOptions } from '@/ports/StorageAdapter';

export interface MockStorageAdapter extends StorageAdapter {
  setNextError(error: Error): void;
  getUploadedRequests(): UploadRequest[];
}

export class MockStorageAdapter implements MockStorageAdapter {
  private nextError: Error | null = null;

  private uploadedRequests: UploadRequest[] = [];

  async upload(uploadRequest: UploadRequest, options: UploadRequestOptions): Promise<void> {
    if (this.nextError) {
      const error = this.nextError;
      this.nextError = null;
      throw error;
    }

    options.progressCallback?.({
      loaded: 0,
      total: 1000,
    });
    options.progressCallback?.({
      loaded: 250,
      total: 1000,
    });
    options.progressCallback?.({
      loaded: 500,
      total: 1000,
    });
    options.progressCallback?.({
      loaded: 750,
      total: 1000,
    });
    options.progressCallback?.({
      loaded: 1000,
      total: 1000,
    });
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
