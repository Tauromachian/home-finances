export class MarketUpstreamError extends Error {
  rateLimited: boolean;

  constructor(message: string, rateLimited = false) {
    super(message);
    this.name = "MarketUpstreamError";
    this.rateLimited = rateLimited;
  }
}
