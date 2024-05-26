import { createInjectionToken } from '@ab/di-container';
import { MediaLibrary } from '@/ports/MediaLibrary';

export const mediaLibraryToken = createInjectionToken<MediaLibrary>('MediaLibrary');
