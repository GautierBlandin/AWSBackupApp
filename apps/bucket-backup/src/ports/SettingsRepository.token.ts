import { createInjectionToken } from '@bucket-backup/di-container';
import { SettingsRepository } from './SettingsRepository';

export const settingsRepositoryToken = createInjectionToken<SettingsRepository>(
  'SettingsRepository',
);
