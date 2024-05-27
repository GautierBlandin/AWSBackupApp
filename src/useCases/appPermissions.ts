import { mediaLibraryToken } from '@/ports/MediaLibraryToken';
import { inject } from '@ab/di-container';

export class AppPermissionsUseCase {
  private readonly mediaLibrary = inject(mediaLibraryToken);

  public async requestPermissions(): Promise<void> {
    await this.mediaLibrary.requestPermissionsAsync();
  }
}
