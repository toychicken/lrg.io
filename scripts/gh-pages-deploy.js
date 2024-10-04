import { execa } from 'execa';
const folderName = 'docs';
const buildFolder = 'public' // should be same as publishDir in /config.yaml 
const pagesBranch =  'gh-pages';
const nixThese = ['_old_content', 'archetypes', 'content', 'static', 'themes', 'tweets'];

// note! This puts the generated folder at the root of the directory in this working copy of the repo

(async () => {

  const nixy = async (xfolder) => {
    await execa("rm", ["-r", xfolder])
  }

  try {
    await execa("git", ["checkout", "--orphan", pagesBranch]);
    console.log("Building...");
    // build into the dist folder (folderName)
    await execa("hugo");
    await execa("mv", [`${buildFolder}`, `${folderName}`]);
    nixThese.forEach(nixy)
    console.log("Built and moved to 'docs'");
    await execa("git", ["--work-tree", folderName, "add", "--all"]);
    await execa("git", ["--work-tree", folderName, "commit", "-m", pagesBranch]);
    // push, and wait for the magic
    console.log(`Pushing to ${pagesBranch}...`);
    await execa("git", ["push", "origin", `HEAD:${pagesBranch}`, "--force"]);
    console.log(`Removing that ${folderName} folder`);
    await execa("rm", ["-r", folderName]);
    await execa("git", ["checkout", "-f", "main"]);
    await execa("git", ["branch", "-D", pagesBranch]);
    console.log("Successfully deployed");
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
})();