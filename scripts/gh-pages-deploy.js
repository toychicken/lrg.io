import { execa } from 'execa';
const mainBranch = 'main';
const folderName = 'docs';
const buildFolder = 'public' // should be same as publishDir in /config.yaml 
const pagesBranch =  'gh-pages';
const nixThese = ['_old_content', 'archetypes', 'content', 'static', 'themes', 'tweets'];

// note! This puts the generated folder at the root of the directory in this working copy of the repo

(async () => {

  const nixy = async (xfolder) => {
    await execa("rm", ["-r", xfolder])
  }

  const std = {stdout: 'inherit', stderr: 'inherit'};

  try {
    // create orphan branch from whatever the current branch is - this is probably bad
    await execa(std)`git stash save "Deploy attempt" -a` // safety stash
    await execa("git", ["checkout", "--orphan", pagesBranch]);
    console.log("Building...");
    // quick cleanup to get rid of redundant images
    // and build into the dist folder (folderName)
    await execa("hugo");

    await execa("mv", [`${buildFolder}`, `${folderName}`]);
    nixThese.forEach(nixy)
    console.log("Built and moved to 'docs'");
    await execa("git", ["--work-tree", folderName, "add", "--all"]);
    await execa("git", ["--work-tree", folderName, "commit", "-m", pagesBranch]);
    // push, and wait for the magic
    console.log(`Pushing to ${pagesBranch}...`);
    await execa(std)`git push origin HEAD:${pagesBranch} --force`;
    console.log(`Removing that ${folderName} folder`);
    await execa("rm", ["-r", folderName]);
    await execa("git", ["checkout", "-f", mainBranch]);
    await execa("git", ["branch", "-D", pagesBranch]);
    console.log("Successfully deployed");
    await execa(std)`git stash pop`;
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
})();