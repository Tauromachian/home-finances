export class FetchNotOkError extends Error {
  status: number;

  constructor(message?: string | null, status: number = 400) {
    message ??= "Issue with response";

    super(message);
    this.status = status;
  }
}
