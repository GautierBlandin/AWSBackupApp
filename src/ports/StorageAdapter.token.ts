import { createInjectionToken } from '@ab/di-container';
import { StorageAdapter } from '@/ports/StorageAdapter';

export const storageAdapterToken = createInjectionToken<StorageAdapter>(
  'storageAdapterToken',
);
