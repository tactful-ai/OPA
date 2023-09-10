import { Mutex } from "async-mutex";
import { Request, Response } from "express";

const mutex = new Mutex();

function handleMutexAsync(asyncFunction: Function) {
  return async function (req: Request, res: Response) {
    try {
      const release = await mutex.acquire();
      try {
        const result = await asyncFunction(req, res);
        return result;
      } finally {
        release();
      }
    } catch (error: any) {
      console.error("An error occurred:", error);
      res.status(400).json({ error: error.message || "An error occurred" });
    }
  };
}

export default handleMutexAsync;
