//!still in progress

import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import gitManager from "./gitManger";

const execAsync = promisify(exec);

const policyDir = path.join(__dirname, "../gitserver ");
async function runOPATest(): Promise<boolean> {
  const command = `opa.exe test ${policyDir} `;

  const result = await exec(command);
  console.log("OPA test completed successfully");
  return true;
}

const runOPATestWrapper = async () => {
  if (process.env.RUN_TESTS == "false") {
    return true;
  }

  try {
    await runOPATest();
    return true;
  } catch (error) {
    await gitManager.reset();
    return false;
  }
};
export default runOPATestWrapper;
