import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { simpleGit } from "simple-git";
import { promisify } from "util";
import fileManger from "./fileManger";
import { subscribe } from "diagnostics_channel";
import e from "express";

require("dotenv").config();

const mkdirAsync = promisify(fs.mkdir);
const execAsync = promisify(exec);
const accessAsync = promisify(fs.access);

class GitManager {
  git: any;
  policyDir: string = "";
  init = () => {
    this.policyDir = fileManger.OPACodePath;
    this.isDirExist().then(async (isExist) => {
      if (!isExist) {
        await this.createDir(this.policyDir);
        this.git = simpleGit(this.policyDir);

        await this.cleanRepo(this.policyDir);
        await this.cloneRepository(process.env.GIT_REPO!, this.policyDir);
        await this.addOrigin();
        this.git.addConfig("user.email", process.env.GIT_EMAIL!);
      } else {
        this.git = simpleGit(this.policyDir);
        this.git.addConfig("user.email", process.env.GIT_EMAIL!);
        await this.pull();
      }
    });
  };

  isDirExist = async (): Promise<boolean> => {
    try {
      await accessAsync(this.policyDir, fs.constants.F_OK);
      return true;
    } catch (err) {
      return false;
    }
  };

  createDir = async (path: string): Promise<void> => {
    await mkdirAsync(path);
  };

  getTags = async () => {
    let tags = await this.git.tag();
    const sortedTags = tags.split("\n").sort((a: any, b: any) => {
      return b.localeCompare(a, undefined, {
        numeric: true,
        sensitivity: "base",
      });
    });

    sortedTags.pop();
    let versionArray = sortedTags[0].split(".");
    versionArray[versionArray.length - 1] = (
      parseInt(versionArray[versionArray.length - 1]) + 1
    ).toString();
    const newTag = versionArray.join(".");
    return { sortedTags, newTag };
  };

  //add tag
  addTag = async (customTag: string) => {
    let success = false;
    try {
      let tags = await this.git.tag();
      tags = tags.split("\n").sort((a: any, b: any) => {
        return b.localeCompare(a, undefined, {
          numeric: true,
          sensitivity: "base",
        });
      });

      let latestTag = "v0.0.0";

      tags.pop();
      if (tags && tags.length > 0) {
        latestTag = tags[0];
      }

      let versionArray = latestTag.split(".");
      versionArray[versionArray.length - 1] = (
        parseInt(versionArray[versionArray.length - 1]) + 1
      ).toString();
      const newTag = customTag || versionArray.join(".");

      await this.git.addAnnotatedTag(newTag, "Release " + newTag);

      await this.git.pushTags();

      console.log("New tag pushed to remote: " + newTag);
      await this.git.push(process.env.REMOTE_NAME, process.env.MAIN_BRANCH);

      console.log("Changes pushed to remote repository.");

      return true;
    } catch (error) {
      console.log(
        "🚀 ~ file: gitManger.ts:120 ~ GitManager ~ addTag= ~ error:",
        error
      );
      return false;
    }
  };

  cleanRepo = async (folderPath: string) => {
    this.git.cwd(folderPath).exec(() => {
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
  };

  cloneRepository = async (url: string, targetPath: string) => {
    await this.git.clone(url, targetPath, ["-b", process.env.MAIN_BRANCH!]);
    console.log(`Cloned repository `);
  };

  addOrigin = async () => {
    await this.git.addRemote(process.env.REMOTE_NAME, process.env.GIT_REPO!);
    console.log(`Added remote ${process.env.REMOTE_NAME} `);
  };

  pull = async () => {
    await this.git.pull(process.env.REMOTE_NAME, process.env.MAIN_BRANCH!);
    console.log(" Pull from Git successfully!");
  };
  reset = async () => {
    this.git.reset(["--hard"], (error: any) => {
      if (error) {
        console.error("Error discarding changes:", error);
        return;
      }
      console.log("Uncommitted changes have been discarded.");
    });
  };

  push = async (commitMessage: string) => {
    await this.git.add(".");
    // Commit the changes
    await this.git.commit(commitMessage);
    // Push the changes to the remote repository (origin) and the current branch
    await this.git.push(process.env.REMOTE_NAME, process.env.MAIN_BRANCH); // Change 'main' to your branch name if different
    console.log("Changes pushed to GIT repo successfully!");
  };
}

const gitManager = new GitManager();

export default gitManager;
