#!/usr/bin/env bash
#
# Creates all 11 feature tickets as GitHub Issues on the market-analyzer repo.
#
# Usage:
#   GITHUB_TOKEN=ghp_xxx bash .github/create-issues.sh
#
# Requirements:
#   - A GitHub personal access token with "repo" scope
#   - curl
#
set -euo pipefail

REPO="nitzan-frock/market-analyzer"
API="https://api.github.com/repos/${REPO}/issues"

if [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "Error: GITHUB_TOKEN environment variable is required."
  echo "Usage: GITHUB_TOKEN=ghp_xxx bash .github/create-issues.sh"
  exit 1
fi

create_issue() {
  local title="$1"
  local body_file="$2"
  local labels="$3"

  local body
  body=$(cat "$body_file")

  local labels_json="[]"
  if [ -n "$labels" ]; then
    labels_json=$(echo "$labels" | jq -R 'split(",")')
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
    echo "  FAILED to create issue: ${title} (HTTP ${http_code})"
    echo "$resp_body" | jq -r '.message // .' 2>/dev/null || echo "$resp_body"
    return 1
  fi
}

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ISSUES_DIR="${SCRIPT_DIR}/issues"

echo "Creating GitHub Issues for ${REPO}..."
echo ""

create_issue \
  "Project Foundation and Infrastructure Setup" \
  "${ISSUES_DIR}/01-project-foundation.md" \
  "setup,infrastructure"

create_issue \
  "Database Schema and Data Layer" \
  "${ISSUES_DIR}/02-database-schema.md" \
  "database,backend"

create_issue \
  "Dashboard Layout Shell" \
  "${ISSUES_DIR}/03-dashboard-layout-shell.md" \
  "frontend,ui"

create_issue \
  "Macro Context Module" \
  "${ISSUES_DIR}/04-macro-context-module.md" \
  "feature,backend,frontend"

create_issue \
  "Overnight Market Structure Module" \
  "${ISSUES_DIR}/05-overnight-structure-module.md" \
  "feature,backend,frontend"

create_issue \
  "Daily Bias Engine" \
  "${ISSUES_DIR}/06-daily-bias-engine.md" \
  "feature,backend,frontend,core-logic"

create_issue \
  "Execution Guidance Module" \
  "${ISSUES_DIR}/07-execution-guidance-module.md" \
  "feature,frontend"

create_issue \
  "Intraday Confirmation Signals" \
  "${ISSUES_DIR}/08-intraday-confirmation-signals.md" \
  "feature,backend,frontend"

create_issue \
  "Trade Qualification Module" \
  "${ISSUES_DIR}/09-trade-qualification-module.md" \
  "feature,frontend"

create_issue \
  "Risk Management Module" \
  "${ISSUES_DIR}/10-risk-management-module.md" \
  "feature,backend,frontend"

create_issue \
  "Post-Trade Review Module" \
  "${ISSUES_DIR}/11-post-trade-review-module.md" \
  "feature,backend,frontend"

echo ""
echo "Done! All issues created."
