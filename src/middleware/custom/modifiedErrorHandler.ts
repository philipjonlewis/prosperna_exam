class modifiedErrorHandler extends Error {
  statusCode: number;
  constructor(err: { statusCode: number; message: string }) {
    super();
    this.statusCode = err.statusCode;
    this.message = err.message;
  }
}

export default modifiedErrorHandler;
