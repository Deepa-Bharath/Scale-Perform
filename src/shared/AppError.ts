export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: string;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = `${statusCode}`.startsWith("4");
    this.status = this.isOperational ? "fail" : "error";
    Error.captureStackTrace(this, this.constructor);
  }
}
