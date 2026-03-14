#!/usr/bin/env bash
#
# Creates GitHub Issues from every .md file in .github/issues/.
#
# Each markdown file is expected to have:
#   - An H1 title on line 1 (e.g. "# Ticket 5: Some Feature")
#   - An optional "## Labels" section followed by a line of
#     backtick-wrapped, comma-separated labels (e.g. `feature`, `backend`)
#
# The H1 becomes the issue title and the full file becomes the body.
#
# Usage:
#   GITHUB_TOKEN=ghp_xxx bash .github/create-issues.sh
#
# Requirements: curl, jq
#
set -euo pipefail

REPO="nitzan-frock/market-analyzer"
API="https://api.github.com/repos/${REPO}/issues"

if [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "Error: GITHUB_TOKEN environment variable is required."
  echo "Usage: GITHUB_TOKEN=ghp_xxx bash .github/create-issues.sh"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ISSUES_DIR="${SCRIPT_DIR}/issues"

if [ ! -d "$ISSUES_DIR" ]; then
  echo "Error: Issues directory not found at ${ISSUES_DIR}"
  exit 1
fi

extract_title() {
  local file="$1"
  head -1 "$file" | sed 's/^# //'
}

extract_labels() {
  local file="$1"
  local in_labels=false
  while IFS= read -r line; do
    if [[ "$line" == "## Labels" ]]; then
      in_labels=true
      continue
    fi
    if $in_labels && [[ -n "$line" ]]; then
      echo "$line" | sed 's/`//g; s/, */,/g'
      return
    fi
  done < "$file"
}

create_issue() {
  local file="$1"
  local title
  title=$(extract_title "$file")
  local labels_csv
  labels_csv=$(extract_labels "$file")
  local body
  body=$(cat "$file")

  local labels_json="[]"
  if [ -n "$labels_csv" ]; then
    labels_json=$(echo "$labels_csv" | jq -R 'split(",")')
  fi

  local payload
  payload=$(jq -n \
    --arg title "$title" \
    --arg body "$body" \
    --argjson labels "$labels_json" \
    '{ title: $title, body: $body, labels: $labels }')

  local response
  response=$(curl -s -w "\n%{http_code}" -X POST "$API" \
    -H "Authorization: token ${GITHUB_TOKEN}" \
    -H "Accept: application/vnd.github+json" \
    -H "Content-Type: application/json" \
    -d "$payload")

  local http_code
  http_code=$(echo "$response" | tail -1)
  local resp_body
  resp_body=$(echo "$response" | sed '$d')

  if [ "$http_code" = "201" ]; then
    local issue_number
    issue_number=$(echo "$resp_body" | jq -r '.number')
    echo "  Created issue #${issue_number}: ${title}"
  else
    echo "  FAILED: ${title} (HTTP ${http_code})"
    echo "$resp_body" | jq -r '.message // .' 2>/dev/null || echo "$resp_body"
    return 1
  fi
}

files=("$ISSUES_DIR"/*.md)

if [ ${#files[@]} -eq 0 ]; then
  echo "No .md files found in ${ISSUES_DIR}"
  exit 0
fi

echo "Creating GitHub Issues for ${REPO}..."
echo "Found ${#files[@]} issue file(s) in ${ISSUES_DIR}"
echo ""

for file in "${files[@]}"; do
  create_issue "$file"
done

echo ""
echo "Done!"
