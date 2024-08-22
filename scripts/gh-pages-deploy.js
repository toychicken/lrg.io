import { execa } from 'execa';
const folderName = 'docs';
const pagesBranch =  'gh-pages';

(async () => {
  try {
    await execa("git", ["checkout", "--orphan", pagesBranch]);
    console.log("Building...");
    // build into the dist folder (folderName)
    await execa("hugo");
    // await execa("cp", [`${folderName}/index.html`, `${folderName}/404.html`]);
    await execa("git", ["--work-tree", folderName, "add", "--all"]);
    await execa("git", ["--work-tree", folderName, "commit", "-m", pagesBranch]);
    // push, and wait for the magic
    console.log(`Pushing to ${pagesBranch}...`);
    await execa("git", ["push", "origin", `HEAD:${pagesBranch}`, "--force"]);
    await execa("rm", ["-r", folderName]);
    await execa("git", ["checkout", "-f", "main"]);
    await execa("git", ["branch", "-D", pagesBranch]);
    console.log("Successfully deployed");
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
})();