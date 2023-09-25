import { unlockOpalCallback } from "../services/lock";
import handleAsync from "../utils/handleAsync";
import { Request, Response } from "express";

const opalCallback = handleAsync(async (req: Request, res: Response) => {
  unlockOpalCallback();
  console.log("opal callback");
  res.send({ message: "OK" });
});
export default opalCallback;
