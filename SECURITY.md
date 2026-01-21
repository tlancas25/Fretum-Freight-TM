# SECURITY.md - Fretum-Freight TMS Security Documentation

**Copyright (c) 2026 Terrell A Lancaster. All Rights Reserved.**

This document outlines the security measures, practices, and guidelines for the Fretum-Freight TMS application.

---

## Table of Contents

1. [Security Architecture](#security-architecture)
2. [Authentication & Authorization](#authentication--authorization)
3. [Data Protection](#data-protection)
4. [API Security](#api-security)
5. [Infrastructure Security (GCP)](#infrastructure-security-gcp)
6. [Secure Development Practices](#secure-development-practices)
7. [Incident Response](#incident-response)
8. [Compliance](#compliance)

---

## Security Architecture

### Defense in Depth

Fretum-Freight TMS implements multiple layers of security:

1. **Network Layer**: GCP Cloud Armor, VPC, firewall rules
2. **Application Layer**: Security headers, input validation, CSRF protection
3. **Data Layer**: Encryption at rest and in transit
4. **Identity Layer**: Firebase Auth with MFA support

### Security Headers

The application enforces the following security headers:

| Header | Value | Purpose |
|--------|-------|---------|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Enforce HTTPS |
| `X-Frame-Options` | `SAMEORIGIN` | Prevent clickjacking |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME sniffing |
| `X-XSS-Protection` | `1; mode=block` | XSS filter |
| `Content-Security-Policy` | See config | Prevent XSS, injection attacks |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Control referrer info |
| `Permissions-Policy` | Restricted | Limit browser features |

---

## Authentication & Authorization

### Authentication

- **Provider**: Firebase Authentication
- **Methods Supported**:
  - Email/Password with strong password policy
  - Google OAuth 2.0
  - SSO (Enterprise customers)
- **Session Management**:
  - Secure, HttpOnly cookies
  - Short session lifetime (1 hour active, 24 hours idle)
  - Automatic session refresh
- **Multi-Factor Authentication**: Required for admin accounts

### Authorization

- **Model**: Role-Based Access Control (RBAC)
- **Roles**:
  - `admin`: Full access
  - `dispatcher`: Load, fleet, and customer management
  - `driver`: Limited to assigned loads and profile
  - `accountant`: Financial data access
  - `viewer`: Read-only access

### Password Policy

- Minimum 12 characters
- Must contain uppercase, lowercase, number, and special character
- No common passwords (dictionary check)
- Password history (prevent reuse of last 5 passwords)
- Account lockout after 5 failed attempts (15-minute lockout)

---

## Data Protection

### Encryption

| Data State | Method |
|------------|--------|
| In Transit | TLS 1.3 (minimum TLS 1.2) |
| At Rest | AES-256 (GCP default encryption) |
| Secrets | Google Secret Manager |
| Backups | AES-256 with separate key management |

### Sensitive Data Handling

**PII Data Types**:
- Customer contact information
- Driver personal information
- Financial data (rates, invoices)
- Location data

**Handling Practices**:
- Data minimization - collect only what's needed
- Automatic PII masking in logs
- Field-level encryption for highly sensitive data
- Data retention policies with automatic purging

### Data Classification

| Level | Examples | Handling |
|-------|----------|----------|
| Public | Company name, load status | Standard protection |
| Internal | Load details, routes | Access control required |
| Confidential | Rates, customer data | Encryption + audit logging |
| Restricted | API keys, passwords | Secret Manager only |

---

## API Security

### Request Validation

All API endpoints validate:
- Content-Type headers
- Request body against Zod schemas
- Query parameters
- Path parameters

### Rate Limiting

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| Authentication | 5 attempts | 15 minutes |
| API Read | 1000 requests | 1 minute |
| API Write | 100 requests | 1 minute |
| File Upload | 10 uploads | 1 minute |

### CORS Policy

- Allowed origins: Production domain only
- Credentials: Required
- Allowed methods: GET, POST, PUT, DELETE, PATCH
- Max age: 86400 seconds

### API Authentication

- Bearer token authentication (Firebase ID tokens)
- Short-lived tokens (1 hour expiry)
- Token validation on every request
- Automatic token refresh

---

## Infrastructure Security (GCP)

### Recommended GCP Configuration

#### Cloud Run / App Hosting

```yaml
# apphosting.yaml security settings
runConfig:
  maxInstances: 10
  minInstances: 1
  cpu: 1
  memoryMiB: 512
  concurrency: 80

env:
  - variable: NODE_ENV
    value: production
```

#### Cloud Armor (WAF)

- Enable OWASP Top 10 protection
- Geographic restrictions (if applicable)
- Rate limiting at edge
- DDoS protection

#### VPC Configuration

- Private Google Access enabled
- Cloud NAT for outbound traffic
- VPC Flow Logs enabled

#### IAM Best Practices

- Principle of least privilege
- Service accounts with minimal permissions
- No long-lived credentials
- Regular access reviews

### Secret Management

**DO NOT** store secrets in:
- Source code
- Environment files in repo
- Container images

**DO** use:
- Google Secret Manager
- Runtime environment injection
- Workload Identity Federation

### Logging & Monitoring

| Service | Purpose |
|---------|---------|
| Cloud Logging | Application logs |
| Cloud Monitoring | Metrics and alerting |
| Cloud Audit Logs | Admin activity |
| Security Command Center | Vulnerability scanning |

---

## Secure Development Practices

### Code Security

1. **Dependencies**:
   - Regular `npm audit` checks
   - Dependabot alerts enabled
   - Lock file committed

2. **Static Analysis**:
   - ESLint security plugin
   - TypeScript strict mode
   - SonarQube (recommended)

3. **Code Review**:
   - All changes require review
   - Security-focused review checklist
   - Automated checks in CI/CD

### CI/CD Security

- Protected branches
- Signed commits (recommended)
- Secrets never in logs
- Container image scanning
- SBOM generation

### Security Testing

| Type | Frequency | Tool |
|------|-----------|------|
| SAST | Every PR | ESLint, TypeScript |
| DAST | Weekly | OWASP ZAP |
| Dependency Scan | Daily | npm audit, Snyk |
| Penetration Testing | Annually | Third-party vendor |

---

## Incident Response

### Response Process

1. **Detection**: Automated alerts, user reports
2. **Triage**: Severity assessment (P1-P4)
3. **Containment**: Isolate affected systems
4. **Eradication**: Remove threat
5. **Recovery**: Restore services
6. **Lessons Learned**: Post-incident review

### Contact

For security issues, contact: **security@fretumfreight.com** (placeholder)

### Severity Levels

| Level | Response Time | Examples |
|-------|---------------|----------|
| P1 - Critical | 15 minutes | Data breach, system compromise |
| P2 - High | 1 hour | Authentication bypass, data exposure |
| P3 - Medium | 4 hours | Minor vulnerability, DoS risk |
| P4 - Low | 24 hours | Informational findings |

---

## Compliance

### Standards & Frameworks

- **SOC 2 Type II** (planned)
- **GDPR** compliant data handling
- **CCPA** consumer rights support
- **FMCSA** regulations compliance

### Regular Audits

- Quarterly security reviews
- Annual third-party penetration testing
- Continuous vulnerability scanning
- Access control reviews

---

## Security Checklist for Production

Before deploying to production, ensure:

- [ ] All environment variables configured via Secret Manager
- [ ] TypeScript strict mode enabled (`ignoreBuildErrors: false`)
- [ ] ESLint enabled (`ignoreDuringBuilds: false`)
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Authentication middleware active
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak sensitive info
- [ ] Logging configured (no PII in logs)
- [ ] Monitoring and alerting configured
- [ ] Backup strategy implemented
- [ ] Incident response plan documented
- [ ] npm audit shows no critical vulnerabilities

---

*Last Updated: January 2026*
*Document Owner: Terrell A Lancaster*
