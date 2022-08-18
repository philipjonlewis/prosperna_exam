// Function that returns only values that return true in the useragent middleware

const userAgentCleaner = async (x: any) => {
  for (const y in x) {
    if (x.hasOwnProperty(y) && x[y] === false) {
      delete x[y];
    }
  }
  return await x;
};

export { userAgentCleaner };
