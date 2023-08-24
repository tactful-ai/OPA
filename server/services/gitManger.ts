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
  init = handleAsync(() => {
    this.policyDir = path.join(__dirname, "/../gitserver");
    this.isDirExist().then(async (isExist) => {
      if (!isExist) {
        await this.createDir(this.policyDir);
        this.git = simpleGit(this.policyDir);

        await this.cleanRepo(this.policyDir);
        await this.cloneRepository(process.env.GIT_REPO, this.policyDir);
        await this.addOrigin();
      } else {
        this.git = simpleGit(this.policyDir);
        await this.pull();
      }
    });
  });

  isDirExist = async (): Promise<boolean> => {
    try {
      await accessAsync(this.policyDir, fs.constants.F_OK);
      return true;
    } catch (err) {
      return false;
    }
  };

  createDir = handleAsync(async (path: string): Promise<void> => {
    await mkdirAsync(path);
  });

  cleanRepo = handleAsync(async (folderPath: string) => {
    this.git
      .cwd(folderPath)
      .silent(true)
      .exec(() => {
        this.git.raw(
          ["rev-parse", "--is-inside-work-tree"],
          (err: any, insideGitRepo: any) => {
            if (insideGitRepo === "true\n") {
              // If inside a Git repository, remove it
              this.git.raw(["rm", "-rf", ".git"], () => {
                console.log("Local Git repository removed.");
              });
            }
          }
        );
      });
  });

  cloneRepository = handleAsync(async (url: string, targetPath: string) => {
    await this.git.clone(url, targetPath, ["-b", "master"]);
    console.log(`Cloned repository `);
  });

  addOrigin = handleAsync(async () => {
    await this.git.addRemote("org", process.env.GIT_REPO!);
    console.log(`Added remote org `);
  });

  pull = handleAsync(async () => {
    await this.git.pull("org", `master`);
    console.log(" Pull from GitHub successfully!");
  });

  push = handleAsync(async (commitMessage: string) => {
    await this.git.add(".");
    // Commit the changes
    await this.git.commit(commitMessage);
    // Push the changes to the remote repository (origin) and the current branch
    await this.git.push("org", `master`); // Change 'main' to your branch name if different
    console.log("Changes pushed to GitHub successfully!");
  });
}

const gitManager = new GitManager();

export default gitManager;
