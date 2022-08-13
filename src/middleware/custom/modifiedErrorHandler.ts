class modifiedErrorHandler extends Error {
  status: number;
  payload: any;
  constructor(
    status: number = 500,
    message: string = "Server Error",
    payload: any = { errorReport: "Please see code" }
  ) {
    super();
    this.status = status;
    this.message = message;
    this.payload = payload;
  }
}

export default modifiedErrorHandler;
