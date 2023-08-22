import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { simpleGit } from "simple-git";
import { promisify } from "util";
import handleAsync from "../utils/handelAsync";

require("dotenv").config();

const mkdirAsync = promisify(fs.mkdir);
const execAsync = promisify(exec);
const accessAsync = promisify(fs.access);

class GitManager {
  git: any;

  policyDir: string = "";
  init() {
    this.policyDir = path.join(__dirname, "/../gitserver");
    this.isDirExist().then((isExist) => {
      if (!isExist) {
        this.createDir(this.policyDir);
        this.git = simpleGit(this.policyDir);
        this.cloneRepository(process.env.GIT_REPO, this.policyDir);
        this.addOrigin();
      } else {
        this.git = simpleGit(this.policyDir);
        this.pull();
      }
    });
  }

  isDirExist = handleAsync(async (): Promise<boolean> => {
    await accessAsync(this.policyDir, fs.constants.F_OK);
    return true;
  });

  createDir = handleAsync(async (path: string): Promise<void> => {
    await mkdirAsync(path);
  });

  cloneRepository = handleAsync(async (url: string, targetPath: string) => {
    await this.git.clone(url, targetPath);
    console.log(`Cloned repository `);
  });

  addOrigin = handleAsync(async () => {
    await this.git.addRemote("origin", process.env.GIT_REPO!);
  });

  pull = handleAsync(async () => {
    await this.git.pull("origin", `master`);
    console.log(" Pull from GitHub successfully!");
  });

  push = handleAsync(async (commitMessage: string) => {
    await this.git.add(".");
    // Commit the changes
    await this.git.commit(commitMessage);
    // Push the changes to the remote repository (origin) and the current branch
    await this.git.push("origin", `master`); // Change 'main' to your branch name if different
    console.log("Changes pushed to GitHub successfully!");
  });
}

const gitManager = new GitManager();

export default gitManager;
