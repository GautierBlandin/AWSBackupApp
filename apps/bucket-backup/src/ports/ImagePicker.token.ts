import { createInjectionToken } from '@bucket-backup/di-container';
import { ImagePicker } from './ImagePicker';

export const imagePickerToken = createInjectionToken<ImagePicker>(
  'imagePickerToken',
);
