import axios from "axios";
import { replaceToFile } from "./file";

require("dotenv").config(); // NOTE: If you turn this into a package this will break stuff

const { GH_KEY, REPO_URL, MAX_PER_BATCH } = process.env;
console.log("");

const API_URL = `https://api.github.com/repos/`;

const config = {
  headers: {
    Authorization: `Bearer ${GH_KEY}`,
    Accept: "application/vnd.github+json",
  },
};

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

  const incrementor = Number(MAX_PER_BATCH);

  for (let i = 0; i < filteredResults.length; i += incrementor) {
    const shortened = filteredResults.slice(i, i + incrementor);

    await Promise.all(
      shortened.map(async (result) =>
        getOneFileAndSaveIt(result.download_url, result.name, REPO_URL)
      )
    );
  }
}

getInfo();
