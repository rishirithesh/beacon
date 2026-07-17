# TESTING.md

# Beacon Testing Strategy

Version: 1.0

---

# Purpose

Beacon investigates software failures.

Incorrect investigations reduce trust.

Testing is therefore a first-class engineering discipline.

Every pull request should improve or maintain

Accuracy

Reliability

Performance

Stability

No feature is complete without tests.

---

# Testing Pyramid

                   E2E Tests
                Integration Tests
             Component / Module Tests
                  Unit Tests

Beacon follows a testing pyramid.

Most tests should be

Unit Tests.

Few should be

End-to-End.

---

# Testing Layers

Beacon is tested at five layers.

1.

Unit Tests

2.

Integration Tests

3.

Extension Tests

4.

AI Evaluation Tests

5.

Performance Tests

---

# Unit Tests

Purpose

Verify individual modules.

Coverage

Schemas

Utilities

Analyzers

Collectors

Rule Engine

Cache

Prompt Builder

Evidence Builder

Confidence Builder

Target

95%+

---

# Integration Tests

Purpose

Verify multiple modules working together.

Examples

Collector

↓

Analyzer

↓

Rule Engine

↓

Engine

↓

Investigation

Verify

Correct data flow

Correct ordering

Correct outputs

---

# VS Code Extension Tests

Purpose

Verify extension behavior.

Test

Activation

Commands

Sidebar

Webview

Settings

Storage

Message Bus

Context Collection

Use

@vscode/test-electron

---

# AI Evaluation Tests

Purpose

Ensure AI quality does not regress.

Unlike unit tests,

these evaluate investigations.

Every AI response is compared against

expected investigations.

---

# Golden Dataset

Maintain a repository of

real-world failures.

Examples

React

TypeScript

Next.js

Node

Python

Flutter

Docker

Git

Every issue contains

Project

Error

Context

Expected Investigation

Expected Root Cause

Expected Confidence

Expected Fix

---

# Evaluation Metrics

Measure

Root Cause Accuracy

Evidence Accuracy

Fix Accuracy

Command Accuracy

Confidence Calibration

Latency

JSON Validity

---

# Root Cause Accuracy

Question

Did Beacon identify the correct root cause?

Score

Correct

Partially Correct

Incorrect

---

# Evidence Accuracy

Question

Did Beacon reference valid evidence?

The model should never invent evidence.

---

# Confidence Calibration

Confidence should match certainty.

High confidence

Only when evidence is strong.

Never inflate confidence.

---

# JSON Validation

Every AI response must validate against

SCHEMA.md

Invalid JSON

is a failed test.

---

# Regression Testing

Every production issue

becomes

a permanent test.

Once Beacon solves an issue,

it should never regress.

---

# Static Analyzer Tests

Every analyzer requires

Positive Cases

Negative Cases

Edge Cases

Malformed Input

Empty Projects

Large Projects

---

# Rule Engine Tests

Verify

Correct Rule Selection

Priority Resolution

Conflict Resolution

Confidence Assignment

Fallback Behavior

---

# Cache Tests

Verify

Cache Hits

Cache Misses

Expiration

Hash Consistency

Invalidation

---

# Collector Tests

Verify

Workspace Detection

Framework Detection

Editor Context

Terminal Context

Environment Context

Configuration Collection

---

# Prompt Builder Tests

Verify

Correct Prompt Assembly

Token Budget

Context Ordering

Secret Redaction

JSON Instructions

Prompt Size

---

# Provider Tests

Every provider must satisfy

Initialize

Health Check

Investigation

Retry

Timeout

Cancellation

JSON Parsing

Fallback

---

# Security Tests

Verify Beacon never uploads

.env

SSH Keys

Certificates

API Keys

Private Keys

Secrets

Tokens

Passwords

Use automated secret scanning.

---

# Privacy Tests

Verify

Sensitive information

is removed

before

prompt generation.

---

# Performance Tests

Measure

Extension Startup

Context Collection

Static Analysis

Rule Engine

Prompt Building

AI Response

Rendering

Memory Usage

CPU Usage

---

# Performance Targets

Extension Startup

<300ms

Context Collection

<100ms

Static Analysis

<100ms

Rule Engine

<30ms

Prompt Build

<20ms

Cache Lookup

<5ms

UI Rendering

<100ms

Total Investigation

<6 seconds

---

# Stress Testing

Run Beacon on

Small Projects

Medium Projects

Large Monorepos

100k+

Files

Verify

Memory

Latency

Cancellation

Stability

---

# End-to-End Tests

Example

Open Workspace

↓

Open File

↓

Run Investigation

↓

Collect Context

↓

Run Engine

↓

Generate Report

↓

Verify Investigation

Every release should pass

all E2E tests.

---

# AI Failure Tests

Simulate

Timeout

Invalid JSON

Provider Offline

Rate Limit

Malformed Response

Partial Response

Beacon must degrade gracefully.

---

# Accessibility Tests

Verify

Keyboard Navigation

Screen Readers

High Contrast

Focus Order

ARIA Labels

---

# Cross Platform Tests

Windows

macOS

Linux

All supported platforms

must pass

core investigation tests.

---

# Continuous Integration

Every pull request runs

Lint

↓

Type Check

↓

Unit Tests

↓

Integration Tests

↓

Extension Tests

↓

Schema Validation

↓

Build

↓

Coverage

↓

AI Evaluation (Nightly)

---

# Code Coverage

Minimum

90%

Critical modules

95%

Engine

100%

Schemas

100%

Rule Engine

100%

---

# Test Naming

Pattern

feature.behavior.expectedResult

Example

engine.collectContext.success

ruleEngine.detectMissingDependency

cache.hit.validEntry

---

# Bug Policy

Every bug fixed

must include

at least one new test.

No exception.

---

# Release Criteria

A release is blocked if

Unit Tests Fail

Schema Validation Fails

AI Evaluation Drops

Performance Regresses

Coverage Falls Below Target

Critical Bugs Exist

---

# Golden Rule

If Beacon cannot reliably explain

why software failed,

it has failed its purpose.

Testing exists to protect that promise.
