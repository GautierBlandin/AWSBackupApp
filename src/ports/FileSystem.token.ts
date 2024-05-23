import { createInjectionToken } from '@ab/di-container';
import { FileSystem } from '@/ports/FileSystem';

export const fileSystemToken = createInjectionToken<FileSystem>(
  'fileSystemToken',
);
