function handleAsync(asyncFunction: any) {
  return async function (...args: any) {
    try {
      const result = await asyncFunction(...args);
      return result;
    } catch (error) {
      console.error("An error occurred:", error);
      // Rethrow the error for the caller to handle if needed
    }
  };
}

export default handleAsync;
