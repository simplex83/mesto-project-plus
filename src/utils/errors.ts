export class NotFoundError extends Error {
  public statusCode;
  constructor(message: string) {
    super(message);
    this.statusCode = 404;
  }
}

export class BadRequestError extends Error {
  public statusCode;
  constructor(message: string) {
    super(message);
    this.statusCode = 400;
  }
}