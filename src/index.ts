#!/usr/bin/env node

import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import program from "commander";
import path from "path";

program
  .version("0.0.1")
  .description("safe dependency update detect cli")
  .option(
    "-p, --package <dir>",
    "specify package.json path",
    path.resolve(__dirname)
  )
  .option("-b, --dir <dir>", "specify bundled dir", path.resolve("dist"))
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  clear();

  console.log(
    chalk.green(figlet.textSync("up-dep", { horizontalLayout: "full" }))
  );
  program.help();
}

if (program.package) console.log(program.package);
if (program.dir) console.log(program.dir);
