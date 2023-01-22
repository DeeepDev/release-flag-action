import * as core from "@actions/core";
import { exec } from "child_process";
import { writeFile } from "fs/promises";
import path from "path";
import { axiosClient } from "./axios";
import { sendTelegramMessage } from "./telegram";
import { ContributorsUrlResponseType, PullsUrlResponseType, TemplateContextType } from "./types";
import { createJpg, renderHbsTemplate } from "./utils";

async function run() {
  const templatePath = path.join(__dirname, "..", "static", "views", "release-flag-template.hbs");

  // ! this object here does not have type, try to add type for
  const githubObject = JSON.parse(core.getInput("repo_github_object"));

  const flagQuality = +core.getInput("flag-quality");

  const { name, contributors_url, pulls_url, stargazers_count, open_issues_count } = githubObject["event"][
    "repository"
  ] as Record<string, string>;

  let contributorsCount, openPRsCount;

  try {
    const { data: contributors } = await axiosClient.get<ContributorsUrlResponseType>(contributors_url);
    contributorsCount = contributors.length;
  } catch (err) {
    console.log(err);
  }

  try {
    const { data: pulls } = await axiosClient.get<PullsUrlResponseType>(pulls_url.replace(/{.*}/, ""));
    openPRsCount = pulls?.filter((pull) => pull.state === "open").length;
  } catch (err) {
    console.log(err);
  }

  const context: TemplateContextType = {
    repoName: name.toUpperCase().replace(/-/g, " "),
    version: core.getInput("version"),
    prerelease: core.getInput("prerelease") === "true",
    startsCount: +stargazers_count,
    openIssuesCount: +open_issues_count,
    contributorsCount: contributorsCount ?? "???",
    openPRsCount: openPRsCount ?? "???",
  };

  const outputFlagPath = path.join(__dirname, "release.jpg");
  core.setOutput("output_flag_path", outputFlagPath);

  renderHbsTemplate(templatePath, context)
    .then((xml) => createJpg(xml, flagQuality))
    .then((buf) => {
      sendTelegramMessage(buf);
      core.setOutput("output_flag_buf", buf);
      writeFile(outputFlagPath, buf);
    });
}

// Install all fonts
exec("bash install_fonts.sh", { cwd: "static" }, (error, stdout, stderr) => {
  if (error) {
    console.error(`fonts install script error: ${error}`);
    return;
  }
  stdout && console.log(`stdout: ${stdout}`);
  stderr && console.error(`stderr: ${stderr}`);

  // run the code and create release flag
  run();
});
