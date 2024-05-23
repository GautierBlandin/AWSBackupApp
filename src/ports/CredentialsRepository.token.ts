import { createInjectionToken } from '@ab/di-container';
import { CredentialsRepository } from '@/ports/CredentialsRepository';

export const credentialsRepositoryToken = createInjectionToken<CredentialsRepository>(
  'CredentialsRepository',
);
