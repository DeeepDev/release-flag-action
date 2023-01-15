import * as core from "@actions/core";
import { Endpoints } from "@octokit/types";
import axios from "axios";
import { exec } from "child_process";
import { readFile, writeFile } from "fs/promises";
import { compile } from "handlebars";
import path from "path";
import sharp from "sharp";

type TemplateContextType = {
  repoName: string;
  version: string;
  prerelease: boolean;
  contributorsCount: number;
  startsCount: number;
  openPRsCount: number;
  openIssuesCount: number;
};

type ContributorsUrlResponseType = Endpoints["GET /repos/{owner}/{repo}/contributors"]["response"]["data"];
type PullsUrlResponseType = Endpoints["GET /repos/{owner}/{repo}/pulls"]["response"]["data"];

/**
 *
 * @param templatePath
 * @param ctx
 * @returns
 */
const renderHbsTemplate = <TContext extends object>(templatePath: string, ctx: TContext): Promise<string> =>
  readFile(templatePath, { encoding: "utf-8" }).then((buf) => compile<TContext>(buf)(ctx));

/**
 *
 * @param xml
 * @returns Promise that resolves to png buffer
 */
const createPng = (xml: string): Promise<Buffer> => sharp(Buffer.from(xml, "utf-8"), { density: 150 }).toBuffer();

async function run() {
  const templatePath = path.join(__dirname, "views", "release-banner-template.hbs");

  // ! this object here does not have type, try to add type for
  const githubObject = JSON.parse(core.getInput("repo_github_object"));

  const { name, contributors_url, pulls_url, stargazers_count, open_issues_count } = githubObject["event"][
    "repository"
  ] as Record<string, string>;

  const { data: contributors } = await axios.get<ContributorsUrlResponseType>(contributors_url);
  const contributorsCount = contributors.length;

  const { data: pulls } = await axios.get<PullsUrlResponseType>(pulls_url.replace(/{.*}/, ""));
  const openPRsCount = pulls.filter((pull) => pull.state === "open").length;

  const context: TemplateContextType = {
    repoName: name.toUpperCase().replace(/-/g, " "),
    version: core.getInput("version"),
    prerelease: core.getInput("prerelease") === "true",
    startsCount: +stargazers_count,
    openIssuesCount: +open_issues_count,
    contributorsCount,
    openPRsCount,
  };

  const outputPath = path.join(__dirname, "release.png");
  core.setOutput("photo_path", outputPath);

  renderHbsTemplate(templatePath, context)
    .then(createPng)
    .then((buf) => {
      core.setOutput("photo_buf", buf);
      writeFile(outputPath, buf);
    });

  console.log(context);
}

// Install all fonts
exec("bash install_fonts.sh", (error, stdout, stderr) => {
  if (error) {
    console.error(`fonts install script error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);

  // run the code and create release flag
  run();
});
