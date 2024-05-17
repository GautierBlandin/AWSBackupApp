import { createInjectionToken } from '@ab/di-container';
import { CredentialsRepository } from '@/ports/CredentialsRepository';
import { AsyncStorageCredentialsRepository } from '@/infrastructure/CredentialsRepository';

export const credentialsRepositoryToken = createInjectionToken<CredentialsRepository>(
  'CredentialsRepository',
  { useClass: AsyncStorageCredentialsRepository },
);
