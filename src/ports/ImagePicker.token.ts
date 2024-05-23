import { createInjectionToken } from '@ab/di-container';
import { ImagePicker } from '@/ports/ImagePicker';

export const imagePickerToken = createInjectionToken<ImagePicker>(
  'imagePickerToken',
);
