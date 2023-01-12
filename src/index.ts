import * as core from "@actions/core";
import axios from "axios";
import { readFile } from "fs/promises";
import { compile } from "handlebars";
import path from "path";
import sharp from "sharp";

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

async function test() {
  const templatePath = path.join(__dirname, "views", "release-banner-template.hbs");

  renderHbsTemplate(templatePath, {})
    .then((xml) => createPng(xml))
    .then(console.log);

  const githubObject = JSON.parse(core.getInput("repo_github_object"));

  const repo_name: string = githubObject["event"]["repository"]["name"];
  const starts_count: string = githubObject["event"]["repository"]["stargazers_count"];
  const open_issues_count = githubObject["event"]["repository"]["open_issues_count"];

  const contributors_url = githubObject["event"]["repository"]["contributors_url"];
  const pulls_url = githubObject["event"]["repository"]["pulls_url"];

  const { data } = await axios.get(contributors_url);

  console.log(data);

  const version = process.env.npm_package_version;

  console.log(core.getInput("repo_github_object"));
  console.log("repo_name: ", repo_name);
  console.log("version: ", version);
  console.log("starts_count: ", starts_count);
  console.log("open_issues_count: ", open_issues_count);
  console.log("pulls_url: ", pulls_url);
}

test();

export {};
