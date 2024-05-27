import { createInjectionToken } from '@bucket-backup/di-container';
import { FileSystem } from './FileSystem';

export const fileSystemToken = createInjectionToken<FileSystem>(
  'fileSystemToken',
);
