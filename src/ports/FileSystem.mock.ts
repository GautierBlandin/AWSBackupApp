import {
  GetInfoResponse, ReadAsStringAsyncOptions, FileSystem, EncodingType,
} from '@/ports/FileSystem';

export class MockFileSystem implements FileSystem {
  private files: { key: string; content: string }[] = [];

  public setFiles(files: { key: string; content: string }[]) {
    this.files = files;
  }

  public async getInfoAsync(fileUri: string): Promise<GetInfoResponse> {
    const fileExists = this.files.some((file) => file.key === fileUri);
    return {
      exists: fileExists,
    };
  }

  public async readAsStringAsync(
    fileUri: string,
    options: ReadAsStringAsyncOptions,
  ): Promise<string> {
    const foundFile = this.files.find((file) => file.key === fileUri);

    if (!foundFile) {
      throw new Error(`File not found: ${fileUri}`);
    }

    const { content } = foundFile;

    switch (options.encoding) {
      case EncodingType.UTF8:
        return content;
      case EncodingType.Base64:
        return Buffer.from(content).toString('base64');
      default:
        throw new Error(`Unsupported encoding: ${options.encoding}`);
    }
  }
}
