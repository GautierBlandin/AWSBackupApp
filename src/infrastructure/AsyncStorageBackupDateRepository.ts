import { BackupDateRepository } from '@/ports/BackupDateRepository';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class AsyncStorageBackupDateRepository implements BackupDateRepository {
  async getBackupDate(): Promise<Date | undefined> {
    const backupDate = await AsyncStorage.getItem('backupDate');
    return backupDate ? new Date(backupDate) : undefined;
  }

  async setBackupDate(date: Date): Promise<void> {
    await AsyncStorage.setItem('backupDate', date.toISOString());
  }
}
