import { createInjectionToken } from '@ab/di-container';
import { FileSystem } from '@/ports/FileSystem';
import { ExpoFileSystem } from '@/infrastructure/ExpoFileSystem';

export const fileSystemToken = createInjectionToken<FileSystem>(
  'fileSystemToken',
  { useClass: ExpoFileSystem },
);
