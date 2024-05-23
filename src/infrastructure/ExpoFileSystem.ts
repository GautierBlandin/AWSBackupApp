import * as FileSystem from 'expo-file-system';
import {
  FileSystem as FileSystemInterface, GetInfoResponse, ReadAsStringAsyncOptions,
} from '@/ports/FileSystem';

export class ExpoFileSystem implements FileSystemInterface {
  async getInfoAsync(fileUri: string): Promise<GetInfoResponse> {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    return {
      exists: fileInfo.exists,
    };
  }

  async readAsStringAsync(fileUri: string, options: ReadAsStringAsyncOptions): Promise<string> {
    return FileSystem.readAsStringAsync(fileUri, options);
  }
}
