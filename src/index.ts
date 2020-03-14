#!/usr/bin/env node

import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import program from "commander";
import path from "path";
import { execSync } from "child_process";
import { mkdtempSync } from "fs";

function logExecSync(cmd: string) {
  console.log(`start ${cmd}`);
  console.log(execSync(cmd).toString());
  console.log(`cat package.json`);
}

program
  .version("0.0.1")
  .description("safe dependency update detect cli")
  .option(
    "-d, --bundledir <dir>",
    "specify bundler's output dir",
    path.resolve("dist")
  )
  .option("-c, --cmd <cmd>", "specify command to generate bundle asset")
  .option("-C, --clean <cmd>", "specify clean cache command")
  .option("-l, --latest", "upgrade latest or not(semver latest) flag")
  .option("-i, --ignore <packages>", "specify ignore package names split with `,`.")
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  clear();

  console.log(
    chalk.green(figlet.textSync("up-dep", { horizontalLayout: "full" }))
  );
  program.help();
}

if (program.bundledir) console.log(program.bundledir);
if (program.cmd) {
  console.log(program.cmd);
} else {
  console.log("--cmd option value is required");
  process.exit(1);
}

const bundleDir = program.bundledir;
const cleanCommand = program.clean;
const buildCommand = program.cmd;
const outdatedDetectCommand = "yarn outdated --json";
const updateLatest = program.latest;
const ignorePackages = (program.ignore as string).split(',');

let output = null;

try {
  execSync(outdatedDetectCommand);
} catch (error) {
  output = (error.stdout as Buffer).toString();
}

if (!output) {
  console.log("no outdated package detected");
  process.exit(0);
}

console.log(output.split("\n")[1]);

interface Table {
  type: "table";
  data: {
    head: ["Package", "Current", "Wanted", "Latest", "Package Type", "URL"];
    body: [string, string, string, string, string, string][];
  };
}

const outdated: Table = JSON.parse(output.split("\n")[1]);
const to = (body: Table["data"]["body"][0]) => {
  return {
    package: body[0],
    current: body[1],
    wanted: body[2],
    latest: body[3],
    packageType: body[4],
    homePage: body[5],
  };
};

const bodies = outdated.data.body
  .map(pkg => to(pkg))
  .filter(e => ignorePackages.includes(e.package));

if (cleanCommand) {
  logExecSync(cleanCommand);
}
logExecSync("yarn install --network-timeout 1000000000  --check-file");
logExecSync(buildCommand);
const rootTmpDir = mkdtempSync("root");
logExecSync(`mv ${bundleDir}/* ${rootTmpDir}/`);

if (updateLatest) {
  bodies.forEach(e => {
    if (cleanCommand) {
      logExecSync(cleanCommand);
    }

    logExecSync("yarn install --network-timeout 1000000000  --check-file");
    logExecSync(
      `yarn upgrade ${e.package} --latest --network-timeout 1000000000`
    );
    logExecSync(buildCommand);
    const packageTmpDir = mkdtempSync(`${e.package}${e.wanted}`);
    logExecSync(`mv ${bundleDir}/* ${packageTmpDir}/`);
    logExecSync("git reset --hard HEAD");
  });
} else {
  bodies.forEach(e => {
    if (cleanCommand) {
      execSync(cleanCommand);
    }

    logExecSync("yarn install --network-timeout 1000000000  --check-file");
    logExecSync(
      `yarn upgrade ${e.package}@${e.wanted} --network-timeout 1000000000`
    );
    logExecSync(buildCommand);
    const packageTmpDir = mkdtempSync(`${e.package}${e.wanted}`);
    logExecSync(`mv ${bundleDir}/* ${packageTmpDir}/`);
    logExecSync("git reset --hard HEAD");
  });
}

console.log("finish");
