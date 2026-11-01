import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const run = (cmd, args) => execFileSync(cmd, args, { encoding: 'utf8' }).trim();
const write = (name, value) => fs.writeFileSync(name, JSON.stringify(value, null, 2) + '\n');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
if (process.env.GITHUB_ACTIONS !== 'true') throw new Error('Release artifacts must be built in GitHub Actions');
fs.mkdirSync('dist', { recursive: true });

if (process.argv[2] === 'plan') {
  const baseSha = process.env.BASE_SHA;
  if (!/^[a-f0-9]{40}$/.test(baseSha ?? '')) throw new Error('Exact deployed BASE_SHA required');
  run('git', ['cat-file', '-e', `${baseSha}^{commit}`]);
  run('git', ['merge-base', '--is-ancestor', baseSha, 'HEAD']);
  const headSha = run('git', ['rev-parse', 'HEAD']);
  const changedPaths = run('git', ['diff', '--name-only', `${baseSha}..HEAD`]).split('\n').filter(Boolean);
  const has = regex => changedPaths.some(p => regex.test(p));
  const dependenciesChanged = has(/^package(?:-lock)?\.json$/);
  const prismaSchemaChanged = has(/^prisma\/schema\.prisma$/);
  const prismaMigrationChanged = has(/^prisma\/migrations\//);
  // Database and dependency releases need a separate reviewed installation/migration design.
  if (dependenciesChanged || prismaSchemaChanged || prismaMigrationChanged) {
    throw new Error('This initial release path only permits application/deployment changes');
  }
  const docsOnly = changedPaths.every(p => /^(README\.md|docs\/|AGENTS\.md|CLAUDE\.md)/.test(p));
  const codeChanged = has(/^(src\/|data\/|artifacts\/|public\/|next\.config)/);
  const deploymentChanged = has(/^(\.github\/|scripts\/.*release|tsconfig\.tool-config)/);
  write('dist/deployment-plan.json', {
    baseSha, headSha, changedPaths, releaseType: docsOnly ? 'documentation' : 'mixed',
    codeChanged, uiChanged: has(/^src\/components\//), workerChanged: false,
    dependenciesChanged, lockfileChanged: false, prismaSchemaChanged, prismaMigrationChanged,
    deploymentChanged, docsOnly, applicationReleaseRequired: codeChanged,
    requiresBuild: codeChanged, requiresInstall: false, requiresMigration: false,
    requiresWorkerRestart: false, requiresWebRestart: codeChanged, requiresDeploy: codeChanged,
    requiresManualDeploymentReview: deploymentChanged,
    lockfileSha256: hash('package-lock.json'),
  });
} else if (process.argv[2] === 'package') {
  const plan = JSON.parse(fs.readFileSync('dist/deployment-plan.json', 'utf8'));
  if (!plan.applicationReleaseRequired) throw new Error('No application release required');
  const stage = 'dist/stage';
  fs.mkdirSync(stage, { recursive: true });
  fs.cpSync('.next/standalone', stage, { recursive: true });
  fs.cpSync('.next/static', `${stage}/.next/static`, { recursive: true });
  for (const dir of ['data', 'artifacts', 'public']) {
    if (fs.existsSync(dir)) fs.cpSync(dir, `${stage}/${dir}`, { recursive: true });
  }
  // Keep the tracked source and configuration available for audit and handover.
  for (const file of run('git', ['ls-files']).split('\n')) {
    if (!file || /^(data\/|artifacts\/|public\/|\.env(?:\.|$))/.test(file)) continue;
    fs.mkdirSync(path.dirname(`${stage}/${file}`), { recursive: true });
    fs.copyFileSync(file, `${stage}/${file}`);
  }
  fs.copyFileSync('scripts/deploy-ci-release.sh', `${stage}/deploy-ci-release.sh`);
  fs.copyFileSync('dist/deployment-plan.json', `${stage}/deployment-plan.json`);
  write(`${stage}/RELEASE-METADATA.json`, {
    commit: plan.headSha, baseSha: plan.baseSha,
    runId: process.env.GITHUB_RUN_ID, repository: process.env.GITHUB_REPOSITORY,
  });
  function inspect(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (/^(\.env(?:\..*)?|\.git|\.secrets|uploads|coverage|\.next-dev|\._.*)$/.test(entry.name) || /\.(log|tsbuildinfo)$/.test(entry.name)) {
        throw new Error(`Forbidden artifact path: ${file}`);
      }
      if (entry.isDirectory()) inspect(file);
      if (entry.isSymbolicLink()) {
        const target = fs.realpathSync(file);
        if (!target.startsWith(path.resolve(stage) + path.sep)) throw new Error(`External symlink: ${file}`);
      }
    }
  }
  inspect(stage);
  for (const file of ['server.js', '.next/BUILD_ID', 'node_modules/next/package.json', 'RELEASE-METADATA.json']) {
    if (!fs.existsSync(`${stage}/${file}`)) throw new Error(`Missing runtime path: ${file}`);
  }
  // Exactly the Next-traced runtime dependency tree is shipped; never the source node_modules.
  run('tar', ['-czf', 'dist/lili-release.tar.gz', '-C', stage, '.']);
  const sha256 = hash('dist/lili-release.tar.gz');
  const manifest = { commit: plan.headSha, baseSha: plan.baseSha, sha256, artifact: 'lili-release.tar.gz' };
  write('dist/release-manifest.json', manifest);
  write('dist/release-check.json', { ...manifest, ok: true, pathsChecked: true });
  fs.rmSync(stage, { recursive: true });
} else throw new Error('Expected plan or package');
