export class TokenRefreshFailedError extends Error {
  public readonly originalError: unknown;
  public readonly statusCode?: number;

  constructor(message: string, originalError: unknown, statusCode?: number) {
    super(message);
    this.name = "TokenRefreshFailedError";
    this.originalError = originalError;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, TokenRefreshFailedError.prototype);
  }
}
