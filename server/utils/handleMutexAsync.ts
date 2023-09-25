import { Mutex } from "async-mutex";
import { Request, Response } from "express";
import gitManager from "../services/gitManger";

const mutex = new Mutex();

function handleMutexAsync(asyncFunction: Function) {
  return async function (req: Request, res: Response) {
    const release = await mutex.acquire();

    try {
      const result = await asyncFunction(req, res);
      release();

      return result;
    } catch (error: any) {
      release();

      console.error("An error occurred:", error);
      // gitManager.reset();
      res.status(400).json({ error: error.message || "An error occurred" });
    }
  };
}

export default handleMutexAsync;
