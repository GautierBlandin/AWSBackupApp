import { createInjectionToken } from '@ab/di-container';
import { SettingsRepository } from '@/ports/SettingsRepository';

export const settingsRepositoryToken = createInjectionToken<SettingsRepository>(
  'SettingsRepository',
);
