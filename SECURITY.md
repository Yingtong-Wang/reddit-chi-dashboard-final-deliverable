# Security Policy

## Supported Versions

Use this section to tell people about which versions of your project are
currently being supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.3.x   | :white_check_mark: |
| 1.2.x   | :white_check_mark: |
| 1.1.x   | :white_check_mark: |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability within Reddit CHI Dashboard, please send an email to [security@example.com](mailto:security@example.com). All security vulnerabilities will be promptly addressed.

Please include the following information in your report:

- **Type of issue** (buffer overflow, SQL injection, cross-site scripting, etc.)
- **Full paths of source file(s) related to the vulnerability**
- **The location of the affected source code (tag/branch/commit or direct URL)**
- **Any special configuration required to reproduce the issue**
- **Step-by-step instructions to reproduce the issue**
- **Proof-of-concept or exploit code (if possible)**
- **Impact of the issue, including how an attacker might exploit it**

This information will help us triage your report more quickly.

## Disclosure Policy

When we receive a security bug report, we will:

1. Confirm the problem and determine the affected versions
2. Audit code to find any similar problems
3. Prepare fixes for all supported versions
4. Release a new version with the fix
5. Publicly announce the security issue

## Security Best Practices

When contributing to this project, please follow these security guidelines:

- Never commit sensitive information (API keys, passwords, etc.)
- Validate all user inputs
- Use parameterized queries to prevent SQL injection
- Implement proper authentication and authorization
- Keep dependencies updated
- Follow the principle of least privilege

## Security Updates

Security updates will be released as patch versions (e.g., 1.3.1, 1.3.2) and will be clearly marked in the changelog. We recommend keeping your installation updated to the latest version to ensure you have all security patches. 