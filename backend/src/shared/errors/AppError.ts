export class AppError extends Error {
  constructor(
    public readonly code: string,
    public readonly statusCode: number,
    public readonly clientMessage: string,
    public readonly internalMessage?: string
  ) {
    super(internalMessage || clientMessage);
    this.name = "AppError";
  }
}
