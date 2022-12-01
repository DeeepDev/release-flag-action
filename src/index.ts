import * as core from "@actions/core";
import * as github from "@actions/github";

try {
  const testInput = core.getInput("test-input");
  console.log(testInput);
  core.setOutput("test-output", "a value for test-output");
  console.log(github.context);
} catch (error) {
  if (error instanceof Error) core.setFailed(error.message);
}
