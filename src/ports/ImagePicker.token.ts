import { createInjectionToken } from '@ab/di-container';
import { ImagePicker } from '@/ports/ImagePicker';
import { ExpoImagePicker } from '@/infrastructure/ExpoImagePicker';

export const imagePickerToken = createInjectionToken<ImagePicker>(
  'imagePickerToken',
  { useClass: ExpoImagePicker },
);
