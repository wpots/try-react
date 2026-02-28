# User Story 017: Integrate Aikido Security Scanning

## 1. Title

Set up Aikido for automated application security scanning and dependency vulnerability monitoring.

## 2. Goal

To continuously scan the Food Diary codebase for security vulnerabilities, exposed secrets, outdated dependencies with CVEs, and misconfigurations — with results surfaced directly in the GitHub PR workflow.

## 3. Description

As a developer, I want automated security feedback on every pull request so that vulnerabilities and secrets are caught before they reach production. Aikido connects to the GitHub repository, scans on push/PR, and reports findings in a dashboard and as PR comments.

Aikido's free tier covers open-source / hobby projects and includes SAST, dependency scanning (SCA), secrets detection, and Docker image scanning — making it appropriate for this stage of the project.

## 4. Technical Details

- **Tool:** [Aikido Security](https://aikido.dev) — free tier
- **Integration:** GitHub app (OAuth-based, no CI changes required for basic scanning)
- **Scanning types enabled:**
  - **SAST** — static analysis of TypeScript/JavaScript source
  - **SCA** — software composition analysis of `pnpm-lock.yaml` / `package.json` dependencies
  - **Secrets detection** — scan for hardcoded API keys, tokens, Firebase credentials
  - **Infrastructure / config** — review of Next.js config, environment variable exposure
  - **Container scanning** — if a Dockerfile is added (see Story 014)
- **Branch strategy:** Scan all PRs; block merge on critical severity findings (configurable)
- **Notifications:** Slack or email alerts for new critical/high findings

## 5. Steps to Implement

1. **Create Aikido account:**
   - Sign up at [app.aikido.dev](https://app.aikido.dev) using GitHub SSO
   - Select the free plan (sufficient for a single repo at this scale)

2. **Connect GitHub repository:**
   - In Aikido dashboard → Integrations → GitHub
   - Install the Aikido GitHub App on the `wpots/try-react` repository
   - Aikido will trigger an initial full scan

3. **Review initial scan results:**
   - Triage findings by severity: Critical → High → Medium → Low
   - Ignore / suppress known false positives with justification notes
   - Prioritise any exposed secrets immediately (rotate keys if found)

4. **Configure branch protection (optional but recommended):**
   - In Aikido settings, enable "Block PR merge on critical findings"
   - Align with existing GitHub branch protection rules on `main`

5. **Address any existing vulnerabilities:**
   - Update vulnerable `pnpm` dependencies:
     ```bash
     pnpm audit
     pnpm update --recursive
     ```
   - Remove or replace any packages with no fix available

6. **Add `.aikidoignore` if needed:**
   - Suppress findings in `storybook-static/` (built artefacts, not source)
   - Suppress findings in `v0/` placeholder directory if still present
   - Example:
     ```
     apps/storybook/storybook-static/**
     v0/**
     ```

7. **Set up Slack/email notifications:**
   - In Aikido → Notifications → configure alert channel
   - Alert on: new Critical/High findings, new exposed secrets

8. **Document security policy:**
   - Add `SECURITY.md` at repo root with responsible disclosure contact
   - Note Aikido as the automated scanning tool in place

9. **Ongoing:**
   - Review Aikido dashboard weekly during active development
   - Re-scan on dependency updates (triggered automatically via GitHub App)

## 6. Acceptance Criteria

- [ ] Aikido GitHub App is installed and scanning `wpots/try-react`
- [ ] Initial scan is complete and all Critical/High findings are triaged
- [ ] No hardcoded secrets remain in the codebase
- [ ] Scans run automatically on every PR to `main`
- [ ] Known false positives are suppressed with justification
- [ ] Team is notified of new Critical findings via Slack or email

## 7. Notes / References

- [Aikido docs — GitHub integration](https://docs.aikido.dev/integrations/github)
- [Aikido free plan limits](https://aikido.dev/pricing) — verify limits before scaling
- Related: Story 014 (Vercel deploy) — ensure environment variables are not committed
- Related: Story 012 (server actions) — server-side secrets handling
- If Aikido free tier is insufficient, alternatives: Snyk (free tier), GitHub Dependabot + CodeQL (free for public repos)
