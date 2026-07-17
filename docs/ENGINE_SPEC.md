# ENGINE_SPEC.md

# Beacon Investigation Engine Specification

Version: 1.0

---

# Purpose

The Investigation Engine is the core of Beacon.

It is responsible for transforming raw project context into an evidence-backed investigation.

The engine must remain completely platform independent.

It must not depend on

- VS Code
- React
- Terminal APIs
- Webview APIs
- JetBrains APIs

The engine should only understand Beacon schemas.

---

# Responsibilities

The Investigation Engine is responsible for

✓ Coordinating investigations

✓ Running analyzers

✓ Running rule engine

✓ Calling AI providers

✓ Building evidence

✓ Building confidence

✓ Producing Investigation Reports

---

# Responsibilities It DOES NOT Have

The engine must never

Collect IDE information

Render UI

Read VS Code APIs

Open files

Modify project files

Display notifications

Handle authentication

Store API keys

Those belong to clients.

---

# Investigation Lifecycle

Every investigation must follow this exact sequence.

Developer

↓

Collect Context

↓

Normalize Context

↓

Validate Context

↓

Detect Framework

↓

Run Static Analysis

↓

Execute Rule Engine

↓

Lookup Investigation Cache

↓

AI Investigation (if required)

↓

Evidence Builder

↓

Confidence Builder

↓

Investigation Builder

↓

Return Investigation

---

# Stage 1

Context Validation

Purpose

Ensure required context exists.

Checks

Workspace Exists

Project Exists

Current File Exists

Language Detected

No invalid schema

If validation fails

Return

ContextValidationError

Never call AI.

---

# Stage 2

Context Normalization

Purpose

Convert every project into a common representation.

Normalize

Windows Paths

Linux Paths

Mac Paths

Framework Names

Package Managers

Languages

Terminal Output

Versions

Examples

NodeJS

↓

node

ReactJS

↓

react

pnpm

↓

pnpm

No aliases.

---

# Stage 3

Framework Detection

Purpose

Understand the technology stack.

Detection Sources

package.json

requirements.txt

Cargo.toml

go.mod

pubspec.yaml

pom.xml

composer.json

package-lock.json

yarn.lock

pnpm-lock.yaml

Supported Frameworks

React

Next.js

Vue

Angular

Node

Express

NestJS

Python

FastAPI

Flask

Django

Flutter

Rust

Go

Spring Boot

ASP.NET

Laravel

Rails

Detection Confidence

Each framework receives confidence.

Highest confidence wins.

---

# Stage 4

Static Analysis

Purpose

Detect deterministic issues.

Analyzers

Dependency Analyzer

Import Analyzer

Configuration Analyzer

Environment Analyzer

Version Analyzer

Port Analyzer

File Analyzer

Permission Analyzer

Each analyzer runs independently.

Each analyzer returns

Success

or

Investigation Candidate

Never throw.

---

# Dependency Analyzer

Detect

Missing npm package

Missing Python package

Version mismatch

Peer dependency conflict

Package manager mismatch

Output

Rule ID

Evidence

Fix

Confidence

---

# Import Analyzer

Detect

Broken imports

Missing aliases

Circular imports

Invalid path casing

Unused imports

Output

Affected File

Import

Fix

---

# Configuration Analyzer

Inspect

tsconfig

vite.config

next.config

docker-compose

package.json

eslint

prettier

Output

ConfigurationIssue

---

# Environment Analyzer

Detect

Missing environment variables

Incorrect runtime

Missing SDK

Wrong Node version

Wrong Python version

Output

EnvironmentIssue

---

# Port Analyzer

Detect

Port Occupied

Port Conflict

Permission

Output

PortIssue

---

# File Analyzer

Detect

Missing files

Incorrect casing

Deleted file

Broken references

Output

FileIssue

---

# Stage 5

Rule Engine

Purpose

Convert findings into deterministic investigations.

Example

IF

Import exists

AND

Dependency missing

↓

Missing Dependency

Confidence

100%

Example

IF

tsconfig missing alias

↓

Alias Misconfiguration

Confidence

100%

Rules always override AI.

---

# Rule Priority

Priority

Critical

↓

High

↓

Medium

↓

Low

↓

Informational

Only unresolved investigations continue.

---

# Stage 6

Investigation Cache

Purpose

Avoid repeated AI requests.

Cache Key

Framework

Language

Rule Signature

Normalized Error

Configuration Hash

If cache hit

Return cached investigation.

Never call AI.

---

# Stage 7

AI Investigation

Purpose

Reason over unknown failures.

AI receives

Current File

Selected Code

Relevant Config

Stack Trace

Terminal Output

Framework

Language

Known Findings

Never send

Entire Project

node_modules

.git

dist

build

.env

Secrets

---

# AI Response

Must return JSON

Root Cause

Evidence

Confidence

Affected Files

Fix Steps

Commands

Estimated Time

Potential Side Effects

Alternative Fixes

No markdown.

---

# Stage 8

Evidence Builder

Purpose

Merge all evidence.

Sources

Static Analysis

Rules

AI

Configuration

Dependencies

Project Metadata

Evidence Items

Description

Source

Confidence

Severity

File

Each evidence item is independent.

---

# Stage 9

Confidence Builder

Purpose

Determine investigation confidence.

Confidence is NOT AI confidence.

Confidence is calculated.

Example

Static Rule

100%

↓

Configuration Match

+10

↓

Dependency Match

+5

↓

AI Agreement

+15

↓

Final

96%

AI should never determine confidence alone.

---

# Stage 10

Investigation Builder

Purpose

Construct final Investigation object.

Sections

Summary

Root Cause

Evidence

Fix

Commands

Files

Confidence

Warnings

Estimated Time

Metadata

This is the ONLY object returned.

---

# AI Provider Interface

Every provider implements

initialize()

investigate()

healthCheck()

estimateTokens()

Provider Examples

Gemini

Claude

OpenAI

Ollama

OpenRouter

The engine never imports provider SDKs directly.

---

# Retry Strategy

AI Timeout

↓

Retry Once

↓

Fallback Provider

↓

Return Partial Investigation

Never fail completely.

---

# Performance

Static Analysis

Target

<100ms

Rule Engine

Target

<30ms

Cache

Target

<5ms

AI

Target

<5 seconds

Investigation

Target

<6 seconds

---

# Cancellation

Investigations support cancellation.

If user closes editor

↓

Cancel AI

↓

Cancel analysis

↓

Free resources

---

# Memory

Never store

Source Code

Secrets

Environment Variables

Only store

Anonymous Investigation Hash

Cache

Telemetry

---

# Investigation States

Pending

Collecting Context

Running Static Analysis

Running Rules

Investigating

Building Evidence

Rendering

Completed

Failed

Cancelled

---

# Future Compatibility

The Investigation Engine must never know

whether it is running from

VS Code

CLI

JetBrains

Terminal

GitHub Actions

Only Context changes.

The Engine never changes.

---

# Golden Rule

The Investigation Engine exists to answer one question.

"What is the most probable root cause of this failure?"

Everything else exists to support that answer.
