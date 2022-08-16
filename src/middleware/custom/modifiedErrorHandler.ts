class modifiedErrorHandler extends Error {
  error: any;
  code: any;
  message: any;
  constructor(errorObject: { error: any }) {
    super();
    this.error = errorObject;
  }


}

export default modifiedErrorHandler;
