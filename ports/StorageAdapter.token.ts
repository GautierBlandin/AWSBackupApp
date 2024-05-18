import { createInjectionToken } from '@ab/di-container';
import { StorageAdapter } from '@/ports/StorageAdapter';
import { S3StorageAdapter } from '@/infrastructure/S3StorageAdapter';

export const storageAdapterToken = createInjectionToken<StorageAdapter>(
  'storageAdapterToken',
  { useClass: S3StorageAdapter },
);
