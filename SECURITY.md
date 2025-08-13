# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of the Reddit CHI Dashboard seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### How to Report

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: [INSERT YOUR EMAIL]

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

### What to Include

Please include the requested information listed below (as much as you can provide) to help us better understand the nature and scope of the possible issue:

- Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit the issue

This information will help us triage your report more quickly.

### Preferred Languages

We prefer all communications to be in English.

## Security Update Process

1. **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 48 hours.

2. **Investigation**: We will investigate and validate the security issue within 5 business days.

3. **Resolution**: We will work on a fix and prepare a security update.

4. **Disclosure**: We will coordinate the disclosure of the vulnerability with you.

5. **Release**: We will release the security update and publicly disclose the vulnerability.

## Security Best Practices

### For Users

- Always use the latest version of the dashboard
- Keep your Node.js and npm versions up to date
- Use HTTPS when deploying the dashboard
- Regularly update dependencies
- Follow secure deployment practices

### For Developers

- Keep dependencies up to date
- Use security linting tools
- Follow secure coding practices
- Validate all user inputs
- Use environment variables for sensitive data
- Regular security audits

## Dependencies Security

We regularly monitor our dependencies for security vulnerabilities using:

- GitHub Dependabot alerts
- npm audit
- Automated security scanning

## Data Privacy

The Reddit CHI Dashboard:

- Does not collect personal user data
- Uses publicly available Reddit data
- Does not store user credentials
- Follows data minimization principles

## Deployment Security

### Vercel Deployment

- Use environment variables for sensitive configuration
- Enable HTTPS (automatic with Vercel)
- Configure proper CORS policies
- Monitor deployment logs

### Self-Hosted Deployment

- Use HTTPS certificates
- Configure proper firewall rules
- Regular security updates
- Monitor access logs
- Use secure authentication methods

## Security Headers

The application implements security headers including:

- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy

## Vulnerability Disclosure Timeline

- **Day 0**: Vulnerability reported
- **Day 1-2**: Acknowledgment sent
- **Day 3-7**: Investigation and validation
- **Day 8-30**: Fix development and testing
- **Day 31**: Security update released
- **Day 32**: Public disclosure (if appropriate)

## Bug Bounty Program

Currently, we do not have a formal bug bounty program. However, we greatly appreciate security researchers who responsibly disclose vulnerabilities and will acknowledge their contributions.

## Contact Information

For security-related questions or concerns:

- **Email**: [INSERT YOUR EMAIL]
- **GitHub**: Create a private security advisory
- **Response Time**: Within 48 hours

## Attribution

We will acknowledge security researchers who responsibly disclose vulnerabilities in:

- Security advisories
- Release notes
- Hall of fame (if applicable)

Thank you for helping keep the Reddit CHI Dashboard secure!