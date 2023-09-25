import gitManager from "../services/gitManger";
import handleAsync from "../utils/handleAsync";
import handleMutexAsync from "../utils/handleMutexAsync";
import { Request, Response } from "express";

const addTag = handleMutexAsync(async (req: Request, res: Response) => {
  const result = await gitManager.addTag(req.body.tag);
  if (!result) {
    return res.status(400).json({ message: "Failed to add tag" });
  }
  return res.send({ message: "Tag added successfully" });
});

const getTag = handleAsync(async (req: Request, res: Response) => {
  let { sortedTags, newTag } = await gitManager.getTags();
  return res.send({ sortedTags, newTag });
});
export { addTag, getTag };
