import { Endpoints } from "@octokit/types";

export type TemplateContextType = {
  repoName: string;
  version: string;
  prerelease: boolean;
  contributorsCount: number | string;
  startsCount: number | string;
  openPRsCount: number | string;
  openIssuesCount: number | string;
};

export type ContributorsUrlResponseType = Endpoints["GET /repos/{owner}/{repo}/contributors"]["response"]["data"];
export type PullsUrlResponseType = Endpoints["GET /repos/{owner}/{repo}/pulls"]["response"]["data"];
