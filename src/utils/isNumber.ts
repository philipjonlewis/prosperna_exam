// Checks if value is a number - mainly used for incoming query params 

export const isNumber = (n: any) => {
    return !isNaN(parseFloat(n)) && !isNaN(n - 0);
  };
  