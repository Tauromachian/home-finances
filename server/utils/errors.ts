export class MarketUpstreamError extends Error {
  rateLimited: boolean;

  constructor(message: string, rateLimited = false) {
    super(message);
    this.name = "MarketUpstreamError";
    this.rateLimited = rateLimited;
  }
}

export class FetchNotOkError extends Error {
  status: number;

  constructor(message?: string | null, status: number = 400) {
    message ??= "Issue with response";

    super(message);
    this.status = status;
  }
}
