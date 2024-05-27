import * as ExpoFileSystemImport from 'expo-file-system';
import { FileSystem, GetInfoResponse, ReadAsStringAsyncOptions } from '../ports/FileSystem';

export class ExpoFileSystem implements FileSystem {
  async getInfoAsync(fileUri: string): Promise<GetInfoResponse> {
    const fileInfo = await ExpoFileSystemImport.getInfoAsync(fileUri);
    return {
      exists: fileInfo.exists,
    };
  }

  async readAsStringAsync(fileUri: string, options: ReadAsStringAsyncOptions): Promise<string> {
    return ExpoFileSystemImport.readAsStringAsync(fileUri, options);
  }
}
