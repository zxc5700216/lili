#!/usr/bin/env bash
# Accept only a verified artifact from the successful GitHub Actions run.
set -Eeuo pipefail
umask 077
bundle_dir=$(realpath "${1:?artifact directory required}")
expected_base=${2:?deployed commit required}
[[ ${3:-} == --reviewed ]] || { echo 'Review release script and pass --reviewed'; exit 1; }
app=/opt/study-lab-app
releases=/opt/study-lab-releases
shared=/opt/study-lab-runtime
exec 9>/opt/study-lab/.ci-release.lock
flock -n 9 || exit 1
cd "$bundle_dir"
node - "$expected_base" <<'JS'
const fs = require('fs'), crypto = require('crypto');
const p = JSON.parse(fs.readFileSync('deployment-plan.json'));
const m = JSON.parse(fs.readFileSync('release-manifest.json'));
const c = JSON.parse(fs.readFileSync('release-check.json'));
const hash = crypto.createHash('sha256').update(fs.readFileSync('lili-release.tar.gz')).digest('hex');
if (!c.ok || hash !== m.sha256 || hash !== c.sha256 || m.commit !== p.headSha || c.commit !== p.headSha ||
    m.baseSha !== p.baseSha || c.baseSha !== p.baseSha || p.baseSha !== process.argv[2] ||
    !/^[a-f0-9]{40}$/.test(p.headSha) || p.requiresMigration || p.requiresInstall || p.requiresWorkerRestart || !p.requiresWebRestart)
  throw new Error('Invalid artifact, baseline or plan');
JS
if [[ -f "$app/RELEASE.json" ]]; then
  actual_base=$(node -p "JSON.parse(require('fs').readFileSync('$app/RELEASE.json')).commit")
else
  actual_base=$(git -C /opt/study-lab rev-parse HEAD)
fi
[[ "$actual_base" == "$expected_base" ]] || { echo 'Live baseline changed'; exit 1; }
head_sha=$(node -p "JSON.parse(require('fs').readFileSync('release-manifest.json')).commit")
release_id="$(date -u +%Y%m%d-%H%M%S)-$head_sha"
release="$releases/$release_id"
sudo install -d -o "$(id -un)" -g "$(id -gn)" -m 755 "$releases" "$shared"
if [[ ! -e /opt/study-lab-release-log.jsonl ]]; then
  sudo install -o "$(id -un)" -g "$(id -gn)" -m 600 /dev/null /opt/study-lab-release-log.jsonl
fi
mkdir "$release"
python3 - "$bundle_dir/lili-release.tar.gz" <<'PY'
import sys, tarfile
from pathlib import PurePosixPath
with tarfile.open(sys.argv[1]) as archive:
    for m in archive.getmembers():
        p = PurePosixPath(m.name)
        if p.is_absolute() or '..' in p.parts or m.issym() or m.islnk() or not (m.isfile() or m.isdir()):
            raise SystemExit('Unsafe archive entry: ' + m.name)
PY
# The checksum and archive validation both precede extraction.
tar -xzf lili-release.tar.gz -C "$release"
node - "$release" "$head_sha" "$expected_base" <<'JS'
const fs = require('fs'); const m = JSON.parse(fs.readFileSync(process.argv[2] + '/RELEASE-METADATA.json'));
if (m.commit !== process.argv[3] || m.baseSha !== process.argv[4]) throw new Error('Packaged identity mismatch');
JS
# Copy runtime values once; all new releases share these preserved values.
for name in .env .env.local .secrets uploads artifacts; do
  if [[ ! -e "$shared/$name" && -e "$app/$name" ]]; then cp -a "$app/$name" "$shared/$name"; fi
  if [[ -e "$shared/$name" ]]; then
    rm -rf -- "$release/$name"
    ln -s "$shared/$name" "$release/$name"
  fi
done
[[ -f "$release/.env" ]] || { echo 'Missing runtime environment'; exit 1; }
cp release-manifest.json "$release/RELEASE.json"
cp release-check.json "$release/release-check.json"
previous=''
switched=false
record_result() {
  RELEASE_DIR="$release" RELEASE_ID="$release_id" RELEASE_STATUS="$1" node <<'JS'
const fs = require('fs'), cp = require('child_process');
const m = JSON.parse(fs.readFileSync(process.env.RELEASE_DIR + '/RELEASE.json'));
let service; try { service = cp.execFileSync('systemctl', ['is-active', 'study-lab'], {encoding:'utf8'}).trim(); } catch { service = 'inactive'; }
const result = {...m, releaseId: process.env.RELEASE_ID, status: process.env.RELEASE_STATUS,
  database: 'not_rolled_back', migration: 'skipped', service,
  health: process.env.RELEASE_STATUS === 'success' ? 'passed' : 'failed',
  disk: cp.execFileSync('df', ['-h', '/'], {encoding:'utf8'}).trim(), timestamp: new Date().toISOString()};
fs.writeFileSync(process.env.RELEASE_DIR + '/RELEASE-RESULT.json', JSON.stringify(result, null, 2) + '\n');
fs.appendFileSync('/opt/study-lab-release-log.jsonl', JSON.stringify(result) + '\n');
console.log(JSON.stringify(result));
JS
}
rollback() {
  trap - ERR
  if [[ "$switched" == true ]]; then
    sudo ln -s "$previous" "$app.rollback"
    sudo mv -Tf "$app.rollback" "$app"
    sudo systemctl restart study-lab
  fi
  record_result failed || true
  exit 1
}
trap rollback ERR
if [[ -L "$app" ]]; then
  previous=$(readlink -f "$app")
else
  previous="$releases/initial-backup-$release_id"
  sudo mv "$app" "$previous"
fi
# Once the initial directory moves, rollback must also handle a failed link switch.
switched=true
sudo ln -s "$release" "$app.next"
sudo mv -Tf "$app.next" "$app"
sudo systemctl restart study-lab
healthy=false
for attempt in $(seq 1 30); do
  if curl -fsS --max-time 5 http://127.0.0.1:43123/lili/api/health > "$release/health.json" &&
    node -e 'if(!JSON.parse(require("fs").readFileSync(process.argv[1])).ok) process.exit(1)' "$release/health.json" &&
    curl -fsS --max-time 5 http://127.0.0.1:43123/lili/login > /dev/null; then
    healthy=true
    break
  fi
  sleep 2
done
[[ "$healthy" == true ]]
record_result success
trap - ERR
# Retain the initial backup and prior releases for rollback; no runtime cleanup here.
