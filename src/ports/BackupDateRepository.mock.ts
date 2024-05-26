import { BackupDateRepository } from '@/ports/BackupDateRepository';

export class MockBackupDateRepository implements BackupDateRepository {
  private backupDate: Date | undefined;

  async getBackupDate(): Promise<Date | undefined> {
    return this.backupDate;
  }

  async setBackupDate(date: Date): Promise<void> {
    this.backupDate = date;
  }
}
