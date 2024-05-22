export class DisplayableError extends Error {
  public title: string;

  constructor(message: string, title: string) {
    super(message);
    this.title = title;
  }
}
