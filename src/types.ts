import { Endpoints } from "@octokit/types";

export type TemplateContextType = {
  repoName: string;
  version: string;
  prerelease: boolean;
  contributorsCount: number;
  startsCount: number;
  openPRsCount: number;
  openIssuesCount: number;
};

export type ContributorsUrlResponseType = Endpoints["GET /repos/{owner}/{repo}/contributors"]["response"]["data"];
export type PullsUrlResponseType = Endpoints["GET /repos/{owner}/{repo}/pulls"]["response"]["data"];
