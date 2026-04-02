#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const SKILL_SOURCE = path.join(__dirname, "..", "skills", "human", "SKILL.md");
const TARGET_DIR = path.join(process.cwd(), ".claude", "skills", "human");
const TARGET_FILE = path.join(TARGET_DIR, "SKILL.md");

if (fs.existsSync(TARGET_FILE)) {
  console.log("human.md is already installed in this project.");
  console.log(`  ${path.relative(process.cwd(), TARGET_FILE)}`);
  console.log("\nUsage: type /human in Claude Code to generate your project docs.");
  process.exit(0);
}

fs.mkdirSync(TARGET_DIR, { recursive: true });
fs.copyFileSync(SKILL_SOURCE, TARGET_FILE);

console.log("human.md installed!");
console.log(`  Created ${path.relative(process.cwd(), TARGET_FILE)}`);
console.log("\nUsage: type /human in Claude Code to generate your project docs.");
