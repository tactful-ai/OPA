import { unlockOpalCallback } from "../services/lock";
import handleAsync from "../utils/handelAsync";
import { Request, Response } from "express";

const opalCallback = handleAsync(async (req: Request, res: Response) => {
  unlockOpalCallback();
  res.send({ message: "OK" });
});
export default opalCallback;
