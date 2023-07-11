import axios from "axios";
import { replaceToFile } from "./file";

require("dotenv").config(); // NOTE: If you turn this into a package this will break stuff

const { GH_KEY } = process.env;
console.log("");

const API_URL = `https://api.github.com/repos/`;

const REPO_URL = `code-423n4/2023-05-chainlink-findings`;

const config = {
  headers: {
    Authorization: `Bearer ${GH_KEY}`,
    Accept: "application/vnd.github+json",
  },
};

const MAX_PER_BATCH = 20; // TODO: Check API Rate Limits

interface GithubResult {
  name: string;
  download_url: string;
}

async function getOneFileAndSaveIt(url, name, prefix) {
  const dataRes = await axios.get(url, {
    ...config,
    responseType: "blob",
  });

  console.log("dataRes", dataRes);

  // Create Folder
  replaceToFile(dataRes.data, prefix, name);
}

async function getInfo() {
  // Get all files
  const allFilesRes = await axios.get(
    `${API_URL}${REPO_URL}/contents/data`,
    config
  );

  const results: GithubResult[] = allFilesRes.data as GithubResult[];

  // Ignore JSON files
  const filteredResults = results.filter(
    (entry) => !entry.name.includes(".json")
  );

  console.log("filteredResults", filteredResults);

  for (let i = 0; i < filteredResults.length; i += MAX_PER_BATCH) {
    const shortened = filteredResults.slice(i, i + MAX_PER_BATCH);

    await Promise.all(
      shortened.map(async (result) =>
        getOneFileAndSaveIt(result.download_url, result.name, REPO_URL)
      )
    );
  }
}

getInfo();
