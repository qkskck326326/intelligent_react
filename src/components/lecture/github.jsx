import axios from "axios";
import { Octokit } from "@octokit/rest";

const myKey = process.env.NEXT_PUBLIC_ADD_LECTURE_GITHUB_TOKEN;
const repo = `lectureSave`;

const octokit = new Octokit({
  auth: myKey,
});

const getSHA = async (path) => {
  try {
    const result = await octokit.repos.getContent({
      owner: "rudalsdl",
      repo: repo,
      path: path,
    });
    return result.data.sha;
  } catch (e) {
    console.log("error : ", e);
    return undefined;
  }
};

export const fileDelete = async (path) => {
  let sha = await getSHA(path);
  if (sha === undefined) return undefined;
  try {
    const result = await octokit.repos.deleteFile({
      owner: "rudalsdl",
      repo: repo,
      path: path,
      message: "delete file",
      sha: sha,
    });
    return result;
  } catch (e) {
    console.log("error : ", e);
    return undefined;
  }
};

export const fileDeleteMultiple = async (paths) => {
  const results = [];
  for (const path of paths) {
    const sha = await getSHA(path);
    if (sha !== undefined) {
      try {
        const result = await octokit.repos.deleteFile({
          owner: "rudalsdl",
          repo: repo,
          path: path,
          message: "delete file",
          sha: sha,
        });
        results.push(result);
      } catch (e) {
        console.log(`Error deleting ${path}:`, e);
        results.push(undefined);
      }
    } else {
      results.push(undefined);
    }
  }
  return results;
};

export const fileRead = async (path) => {
  try {
    const result = await octokit.repos.getContent({
      owner: "rudalsdl",
      repo: repo,
      path: path,
    });
    return result;
  } catch (e) {
    console.log("error : ", e);
    return undefined;
  }
};
