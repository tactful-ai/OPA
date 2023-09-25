//!still in progress

import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import gitManager from "./gitManger";
import fileManger from "./fileManger";

const execAsync = promisify(exec);

const policyDir =
  process.env.RUN_WITH_DOCKER == "true"
    ? `./build/${fileManger.folderName}`
    : `./${fileManger.folderName}`; //fileManger.OPACodePath;

async function runOPATest(): Promise<boolean> {
  const command = `${process.env.OPA_COMMAND} test ${policyDir} `;

  try {
    const result = await execAsync(command);
    console.log("🚀 ~ file: runTest.ts:17 ~ runOPATest ~ result:", result);
    if (result.stderr) {
      console.log("OPA test failed");
    }
    if (result.stdout) {
      console.log(result.stdout);
      fs.writeFileSync(
        "opa_test_results.txt",
        result.stdout.toString(),
        "utf-8"
      );
    }
    console.log("OPA test completed successfully");
    return true;
  } catch (error) {
    console.log("🚀 ~ file: runTest.ts:17 ~ runOPATest ~ error:", error);
    return false;
  }
}

const runOPATestWrapper = async () => {
  if (process.env.RUN_TESTS == "false") {
    return true;
  }

  console.log("1");
  try {
    const testResult = await runOPATest();
    if (!testResult) {
      throw new Error("OPA test failed");
    }
    return true;
  } catch (error) {
    await gitManager.reset();
    return false;
  }
};
export default runOPATestWrapper;
