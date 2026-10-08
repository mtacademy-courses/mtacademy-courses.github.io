/** Verify exact Git filename casing, even on a case-insensitive local filesystem. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const tracked = new Set(execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean));
const problems = new Map();
let checks = 0;
function check(value, location) {
  if (typeof value !== 'string' || !value.includes('/assets/')) return;
  let asset;
  if (value.startsWith('/assets/') || value.startsWith('./assets/')) asset = value.replace(/^\.?\//, '').split(/[?#]/)[0];
  else if (value.startsWith('https://mtacademy-courses.github.io/assets/')) asset = new URL(value).pathname.slice(1);
  else return;
  checks++;
  if (!tracked.has(asset)) {
    const differentCase = [...tracked].find(file => file.toLowerCase() === asset.toLowerCase());
    problems.set(`${location}: ${asset}`, differentCase ? `Git stores this as ${differentCase}` : 'Asset is missing from the Git index');
  }
}
function walk(value, location) {
  if (typeof value === 'string') check(value, location);
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) walk(child, `${location}.${key}`);
}
const window = {};
for (const file of ['site-core.js', 'site-data.js', 'courses-data.js', 'kids-data.js', 'backend-diploma-data.js', 'learning-paths-data.js']) {
  vm.runInNewContext(fs.readFileSync(path.join(root, 'assets/js', file), 'utf8'), { window, URL, Set }, { filename: file });
}
for (const [key, value] of Object.entries(window)) if (key !== 'MTAcademyCore') walk(value, key);
for (const file of [...tracked].filter(file => file.endsWith('.html') || file.endsWith('.css'))) {
  const content = fs.readFileSync(path.join(root, file), 'utf8');
  // Includes SVG hrefs, srcset entries, stylesheet/script links, and CSS URLs.
  for (const match of content.matchAll(/(?:https:\/\/mtacademy-courses\.github\.io)?\.?\/assets\/[a-zA-Z0-9_./-]+/g)) check(match[0], file);
}
if (problems.size) {
  for (const [location, message] of problems) console.error(`${location}\n  ${message}`);
  process.exitCode = 1;
} else console.log(`PASS: ${checks} asset references match exact tracked Git paths.`);
