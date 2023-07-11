# C4 MD File Fetcher

Fetches MD files from the Private Contest Repo

# WARNING

VERY LIKELY YOU WILL LEAK STUFF!!!

# Usage

Change settings in `.env`

```
GH_KEY=ghp_jUdGingIsEaSyY ## Personal Token with permission to view the private repo
REPO_URL=code-423n4/REPO_HERE ## URL of the REPO
MAX_PER_BATCH=50 ## Tested with 50 is fine, use 20 if you have issues
```

It will create a folder which matches the `REPO_URL` with all QA and Gas reports