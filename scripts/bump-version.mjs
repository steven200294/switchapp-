#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PACKAGES = ['package.json', 'frontend/package.json', 'backend/package.json', 'shared/package.json', 'worker/package.json'];

const type = process.argv[2];
if (!['patch', 'minor', 'major'].includes(type)) {
  console.error('Usage: node scripts/bump-version.mjs [patch|minor|major]');
  process.exit(1);
}

const rootPkg = JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf8'));
const [major, minor, patch] = rootPkg.version.split('.').map(Number);

let next;
if (type === 'major') next = `${major + 1}.0.0`;
else if (type === 'minor') next = `${major}.${minor + 1}.0`;
else next = `${major}.${minor}.${patch + 1}`;

for (const rel of PACKAGES) {
  const abs = resolve(ROOT, rel);
  const pkg = JSON.parse(readFileSync(abs, 'utf8'));
  pkg.version = next;
  writeFileSync(abs, JSON.stringify(pkg, null, 2) + '\n');
}

console.log(`Bumped version: ${rootPkg.version} → ${next}`);

execSync(`git add ${PACKAGES.join(' ')}`, { cwd: ROOT, stdio: 'inherit' });
execSync(`git commit -m "chore: release v${next}"`, { cwd: ROOT, stdio: 'inherit' });
execSync(`git tag v${next}`, { cwd: ROOT, stdio: 'inherit' });

console.log(`Created tag v${next}`);
console.log('Run "git push && git push --tags" to publish.');
