# Security Policy

## Supported Versions

Kalt Code is currently maintained on the latest `main` branch and the latest
npm release only.

| Version | Supported |
| ------- | --------- |
| Latest release | :white_check_mark: |
| Older releases | :x: |
| Unreleased forks / modified builds | :x: |

Security fixes are generally released in the next patch version and may also be
landed directly on `main` before a package release is published.

## Reporting a Vulnerability

If you believe you have found a security vulnerability in Kalt Code, please
report it privately.

Preferred reporting channel:

- GitHub Security Advisories / private vulnerability reporting for this
  repository

Please include:

- a clear description of the issue
- affected version, commit, or environment
- reproduction steps or a proof of concept
- impact assessment
- any suggested remediation, if available

Please do **not** open a public issue for an unpatched vulnerability.

## Credentials, Keys, and Logs

Kalt Code talks to many model providers, so its configuration and output can
contain live credentials. Before you file an issue, attach a log, or paste
terminal output into a discussion, remove anything that could authenticate as
you.

Never include any of the following in a public issue, discussion, PR, screenshot,
or attached report:

- provider API keys, such as `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`,
  `GEMINI_API_KEY`, `DEEPSEEK_API_KEY`, or any `*_API_KEY` value
- gateway or gateway-routing keys, including the KaltCode Gateway key
- GitHub tokens (`ghp_...`, `github_pat_...`) or Actions secrets
- OAuth tokens, refresh tokens, or credential files such as `auth.json`
- entire `.env` files, provider profiles, or `.kaltcode` credential state
- private prompts, source code, or transcripts you are not free to share

Prefer the built-in redacted report instead of hand-pasting raw output:

```bash
kaltcode doctor report --markdown
```

Treat every key you have ever pasted publicly as compromised: revoke it at the
provider, then issue a replacement. Rotating the key is the only reliable
remediation — editing or deleting the public post is not enough, because copies
may already be cached, indexed, or forked.

If you believe a key tied to the Kalt Code project itself has leaked, report it
privately through the channel above rather than opening a public issue.

## Leaked Provider API Keys

A leaked provider key is not itself a vulnerability in Kalt Code, but it is a
security incident for you. If you think a key was exposed through this project's
surfaces — an issue, a log, a release artifact, or the repository itself — report
it privately so maintainers can remove the exposure and tell you what else to
rotate.

## Response Process

Our general goals are:

- initial triage acknowledgment within 7 days
- follow-up after validation when we can reproduce the issue
- coordinated disclosure after a fix is available

Severity, exploitability, and maintenance bandwidth may affect timelines.

## Disclosure and CVEs

Valid reports may be fixed privately first and disclosed after a patch is
available.

If a report is accepted and the issue is significant enough to warrant formal
tracking, we may publish a GitHub Security Advisory and request or assign a CVE
through the appropriate channel. CVE issuance is not guaranteed for every
report.

## Scope

This policy applies to:

- the Kalt Code source code in this repository
- official release artifacts published from this repository
- the `@kaltdev/kaltcode` npm package

This policy does not cover:

- third-party model providers, endpoints, or hosted services
- local misconfiguration on the reporter's machine
- vulnerabilities in unofficial forks, mirrors, or downstream repackages
