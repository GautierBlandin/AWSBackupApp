import { createInjectionToken } from '@ab/di-container';
import { BackupDateRepository } from '@/ports/BackupDateRepository';

export const backupDateRepositoryToken = createInjectionToken<BackupDateRepository>('BackupDateRepository');
