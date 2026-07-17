# PERFORMANCE.md

# Beacon Performance Specification

Version: 1.0

---

# Purpose

Beacon exists to reduce the time required to identify the root cause of software failures.

Performance is therefore a product feature.

Every investigation should feel immediate.

---

# Performance Philosophy

Users should never wait because of Beacon.

Prefer

Fast

Predictable

Incremental

Cached

over

Complex

Expensive

Repeated

---

# Performance Goals

Operation                     Target

Extension Startup             <300ms

Command Execution             <50ms

Context Collection            <100ms

Framework Detection           <50ms

Static Analysis               <100ms

Rule Engine                   <30ms

Prompt Building               <20ms

Cache Lookup                  <5ms

Webview Render                <100ms

Total Investigation           <6 seconds

---

# Startup Performance

Beacon should delay expensive work.

On activation

Register commands

Register providers

Load configuration

Initialize cache

Nothing else.

Heavy operations should happen only when required.

---

# Lazy Loading

The following components should be loaded lazily.

AI Providers

Analyzers

Framework Rules

Prompt Builder

Renderer

Large Configuration Parsers

Never load everything during startup.

---

# Context Collection

Collect only what is required.

Priority

Current File

↓

Selected Code

↓

Stack Trace

↓

Configuration

↓

Dependencies

↓

Related Files

Avoid scanning the entire workspace.

---

# Incremental Analysis

When possible,

reuse previous analysis.

If only the current file changes,

do not rerun

dependency analysis

framework detection

configuration parsing

---

# Caching Strategy

Cache

Framework Detection

Package Metadata

Analyzer Results

Configuration Hashes

Investigation Reports

Do not cache

Current Selection

Terminal Output

Stack Traces

---

# Cache Expiration

Framework

24 hours

Configuration

Until modified

Dependencies

Until lockfile changes

Investigation

30 minutes

Metadata

24 hours

---

# Parallel Execution

Run independent analyzers simultaneously.

Example

Dependency Analyzer

Configuration Analyzer

Import Analyzer

Environment Analyzer

↓

Parallel

↓

Merge Results

---

# Memory Budget

Idle

<50 MB

During Investigation

<250 MB

Peak

<500 MB

Never retain unnecessary data after an investigation.

---

# CPU Usage

Idle

~0%

Investigation

Burst allowed

Background

Minimal

Beacon must not continuously consume CPU.

---

# Prompt Optimization

Never send duplicate information.

Compress repeated stack traces.

Remove irrelevant files.

Prefer summaries over raw data when appropriate.

---

# Token Optimization

Priority

Current Error

Current File

Configuration

Relevant Evidence

Related Files

Dependencies

Everything else should be omitted first.

---

# Workspace Limits

Small Project

<1,000 files

Medium Project

1,000–20,000 files

Large Project

20,000–100,000 files

Enterprise

100,000+ files

Beacon should adapt automatically.

---

# Large Project Strategy

Avoid recursive scanning.

Index metadata.

Load files on demand.

Prefer hash comparisons.

---

# File Reading

Never read

node_modules

.git

dist

build

coverage

vendor

target

Unless explicitly requested.

---

# AI Performance

AI should be the final step.

Maximum retries

1

Maximum timeout

10 seconds

Fallback

Static Investigation

Never block the UI.

---

# Rendering Performance

The UI should remain responsive.

Large investigation reports should be virtualized if necessary.

Avoid unnecessary re-renders.

---

# Background Tasks

Allowed

Cache cleanup

Index refresh

Telemetry upload

Not Allowed

Continuous workspace scanning

Continuous AI requests

Polling without user action

---

# Cancellation

Users may cancel investigations.

Cancellation should stop

AI requests

Analyzer execution

Prompt building

Rendering

Immediately.

---

# Metrics

Track anonymously

Investigation Duration

Static Analysis Duration

AI Duration

Cache Hit Rate

Memory Usage

Startup Time

Never collect source code.

---

# Benchmarking

Every release should benchmark

Small Project

Medium Project

Large Project

Results should be compared with previous releases.

Performance regressions should block releases.

---

# Performance Principles

Measure first.

Optimize second.

Never optimize blindly.

Prefer simplicity over micro-optimizations.

---

# Golden Rule

Beacon should never become the slowest part of a developer's workflow.

Speed builds trust.
