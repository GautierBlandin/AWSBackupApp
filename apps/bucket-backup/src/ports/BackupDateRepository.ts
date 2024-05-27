export interface BackupDateRepository {
  getBackupDate(): Promise<Date | undefined>;
  setBackupDate(date: Date): Promise<void>;
}
