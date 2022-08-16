// export const standardProductionErrorResponse = {
//   error: { code: 500, message: "Internal Server Error" },
// };

export const standardProductionErrorResponse = (code: number) => {
  return {
    error: { code: code, message: "Internal Server Error" },
  };
};
