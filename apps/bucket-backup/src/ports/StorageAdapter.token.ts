import { createInjectionToken } from '@bucket-backup/di-container';
import { StorageAdapter } from './StorageAdapter';

export const storageAdapterToken = createInjectionToken<StorageAdapter>(
  'storageAdapterToken',
);
