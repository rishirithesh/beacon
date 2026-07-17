# SECURITY.md

# Beacon Security & Privacy Specification

Version: 1.0

---

# Purpose

Beacon analyzes software projects.

Developers trust Beacon with their code.

Security and privacy are therefore core product requirements.

No feature may compromise user privacy.

---

# Security Principles

Beacon follows five principles.

1.

Least Privilege

2.

Privacy First

3.

Minimal Data Collection

4.

Secure by Default

5.

Explicit User Control

---

# Threat Model

Beacon assumes

Malicious Dependencies

Compromised AI Providers

Leaked API Keys

Large Workspaces

Sensitive Source Code

Accidental Data Exposure

Every feature must be designed with these threats in mind.

---

# Sensitive Data

Sensitive data includes

API Keys

Passwords

Secrets

Tokens

Certificates

Private Keys

SSH Keys

Cookies

Authentication Headers

Session Tokens

Environment Variables

Personally Identifiable Information

Sensitive data must never leave the machine.

---

# Secret Redaction

Before prompt generation,

Beacon scans collected context.

Known patterns include

.env

AWS Keys

GitHub Tokens

JWT Tokens

Bearer Tokens

OpenAI Keys

Gemini Keys

Claude Keys

Azure Keys

Private Certificates

SSH Keys

Detected secrets are replaced with

[REDACTED]

before AI requests.

---

# Files Never Uploaded

Beacon never uploads

node_modules/

.git/

dist/

build/

coverage/

.cache/

vendor/

target/

bin/

obj/

private/

---

# Files Allowed

Only relevant files.

Examples

Current File

Stack Trace

Configuration

Selected Code

Relevant Imports

Package Metadata

Never entire repositories.

---

# API Key Storage

Provider keys are stored using

VS Code SecretStorage.

Never

settings.json

workspace settings

plain text

temporary files

---

# Network Security

All provider communication

must use HTTPS.

Certificate validation

must remain enabled.

Never disable TLS verification.

---

# Telemetry

Telemetry is

Opt-In.

Collected

Extension Version

Anonymous Errors

Performance Metrics

Investigation Duration

Never collected

Source Code

File Contents

Secrets

Terminal History

Personal Information

---

# Local Cache

Only investigation metadata may be cached.

Never cache

Source code

Secrets

Prompt contents

Environment variables

---

# Logging

Logs must never contain

Secrets

Source Code

Tokens

Passwords

Logs should contain

Timestamps

Performance

Errors

Module Names

---

# Dependency Security

Dependencies should be

Pinned

Reviewed

Updated regularly

Run

npm audit

before releases.

---

# Responsible Disclosure

Security vulnerabilities should be reported privately.

Critical issues

must be fixed

before feature development continues.

---

# Golden Rule

Developer trust is Beacon's most valuable asset.

Never sacrifice privacy for convenience.
