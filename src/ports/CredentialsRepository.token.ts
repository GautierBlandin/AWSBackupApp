import { createInjectionToken } from '@ab/di-container';
import { CredentialsRepository } from '@/ports/CredentialsRepository';
import { AsyncStorageCredentialsRepository } from '@/infrastructure/AsyncStorageCredentialsRepository';

export const credentialsRepositoryToken = createInjectionToken<CredentialsRepository>(
  'CredentialsRepository',
  { useClass: AsyncStorageCredentialsRepository },
);
