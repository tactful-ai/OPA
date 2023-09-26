import path from "path";
import fileManger from "../services/fileManger";
import { lockOpalCallback, waitUntilOpalUnlocked } from "../services/lock";
import handleAsync from "../utils/handleAsync";
import { Request, Response } from "express";
import gitManager from "../services/gitManger";
import handleMutexAsync from "../utils/handleMutexAsync";
import runOPATestWrapper from "../services/runTest";

const readdir = handleAsync(async (req: Request, res: Response) => {
  //Pull the latest changes from Git repository
  await gitManager.pull();
  // Clear the files array
  fileManger.IDEContent = [];
  // Get the latest files
  let x = await fileManger.listFilesRecursively(fileManger.OPACodePath);
  const files = fileManger.IDEContent.map((file) => {
    return {
      code: file.code,
      ID: file.ID,
      file: file.file,
      root: file.root,
      text: file.text,
      children: file.children,
    };
  });
  res.send(files);
});

const updateFiles = handleMutexAsync(async (req: Request, res: Response) => {
  //Pull the latest changes from Git repository
  await gitManager.pull();
  // Clear the files array
  fileManger.IDEContent = [];
  // Get the latest files
  let x = await fileManger.listFilesRecursively(fileManger.OPACodePath);

  // Update files
  await Promise.all(
    req.body.updatedFiles.map(async (file: { code: string; ID: string }) => {
      try {
        await fileManger.write(file.code, file.ID);
      } catch (error) {
        throw new Error("Error writing file");
      }
    })
  );
  // Run OPA test
  if (!(await runOPATestWrapper())) {
    return res.status(400).json({ message: "test failed" });
  }
  // Lock OPAL
  lockOpalCallback();
  // Push changes to Git repository with a commit message
  await gitManager.push("files updated using IDE");
  // wait until OPAL change in OPA is done
  await waitUntilOpalUnlocked();
  return res.json({ message: "files updated successfully" });
});

export { readdir, updateFiles };
