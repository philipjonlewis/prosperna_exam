export const devEnvironment =
  process.env.ENVIRONMENT == "development" ? true : false;

export const standardProductionErrorResponse = {
  statusCode: 500,
  message: "Internal Server Errro",
};
