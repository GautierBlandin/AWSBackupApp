import { createInjectionToken } from '@bucket-backup/di-container';
import { BackupDateRepository } from './BackupDateRepository';

export const backupDateRepositoryToken = createInjectionToken<BackupDateRepository>('BackupDateRepository');
