import { createInjectionToken } from '@bucket-backup/di-container';
import { MediaLibrary } from './MediaLibrary';

export const mediaLibraryToken = createInjectionToken<MediaLibrary>('MediaLibrary');
