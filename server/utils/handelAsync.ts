import { Request, Response } from "express";
function handleAsync(asyncFunction: any) {
  return async function (req: Request, res: Response) {
    try {
      const result = await asyncFunction(req, res);
      return result;
    } catch (error) {
      console.error("An error occurred:", error);
      // Rethrow the error for the caller to handle if needed
      res.status(500).json({ error: "An error occurred" });
    }
  };
}

export default handleAsync;
