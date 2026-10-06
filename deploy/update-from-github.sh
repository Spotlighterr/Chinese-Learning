#!/usr/bin/env bash
set -euo pipefail

repo=/home/spotlighter/Chineseapp
cd "$repo"
mkdir -p .data
exec 9>.data/deploy.lock
flock -n 9 || exit 0

if [[ "$(git branch --show-current)" != main ]]; then
  echo 'Deployment checkout must stay on main' >&2
  exit 1
fi
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo 'Deployment checkout has local changes' >&2
  exit 1
fi

git fetch --no-tags origin \
  refs/heads/main:refs/remotes/origin/main \
  refs/heads/deploy/production:refs/remotes/origin/deploy/production

target=$(git rev-parse refs/remotes/origin/deploy/production)
remote_main=$(git rev-parse refs/remotes/origin/main)
current=$(git rev-parse HEAD)
deployed=$(cat .data/deployed-sha 2>/dev/null || true)

if ! git merge-base --is-ancestor "$target" "$remote_main"; then
  echo 'Verified deployment commit is not on main' >&2
  exit 1
fi
if ! git merge-base --is-ancestor "$current" "$target"; then
  echo 'Deployment would not be a fast-forward' >&2
  exit 1
fi
if [[ "$current" == "$target" && "$deployed" == "$target" ]]; then
  exit 0
fi

if [[ "$current" != "$target" ]]; then
  git merge --ff-only "$target"
fi

export TAILSCALE_IP
TAILSCALE_IP=$(tailscale ip -4)
docker compose -f deploy/docker-compose.yml up -d --build --wait --wait-timeout 120
curl --fail --silent --show-error --max-time 5 "http://${TAILSCALE_IP}:3031/api/health" | grep -q '"ok":true'

printf '%s\n' "$target" > .data/deployed-sha.new
mv .data/deployed-sha.new .data/deployed-sha
echo "Deployed $target"
