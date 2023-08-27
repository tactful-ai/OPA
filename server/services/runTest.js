//!still in progress

const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const policyDir = path.join(__dirname, "/testopa -v");
function runOPATest() {
  const command = `opa.exe test ${policyDir}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      fs.writeFileSync("opa_test_results.txt", stdout, "utf-8");
      console.error("Error:", error.message);
      return;
    }

    // Save the test results to a file
    fs.writeFileSync("opa_test_results.txt", stdout, "utf-8");

    console.log(
      "OPA test completed. Test results saved to opa_test_results.json"
    );
  });
}

runOPATest();
