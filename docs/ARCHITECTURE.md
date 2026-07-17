# ARCHITECTURE.md

# Beacon Architecture Specification

Version: 1.0

---

# Overview

Beacon follows a layered Clean Architecture.

The purpose of this architecture is to ensure that Beacon can support multiple clients (VS Code, CLI, JetBrains, Cursor, PowerShell, GitHub Actions, Docker, etc.) without changing the investigation engine.

The Investigation Engine is the product.

The IDE Extension is only one client.

---

# High-Level Architecture

                          Beacon

┌───────────────────────────────────────────────────────┐
│                    Client Layer                       │
│                                                       │
│  VS Code Extension                                   │
│  CLI                                                  │
│  Cursor                                               │
│  JetBrains                                            │
│  GitHub Actions                                       │
│  Terminal                                              │
└───────────────────────────────────────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────────────┐
│                Context Collection Layer               │
│                                                       │
│ Editor Collector                                      │
│ Workspace Collector                                   │
│ Terminal Collector                                    │
│ Environment Collector                                 │
│ Framework Collector                                   │
│ Project Collector                                     │
└───────────────────────────────────────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────────────┐
│                Investigation Engine                   │
│                                                       │
│ Context Normalizer                                    │
│ Rule Engine                                           │
│ Static Analyzer                                       │
│ Evidence Builder                                      │
│ Cache                                                 │
│ Investigation Builder                                 │
└───────────────────────────────────────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────────────┐
│                    AI Layer                           │
│                                                       │
│ Gemini Provider                                       │
│ OpenAI Provider                                       │
│ Claude Provider                                       │
│ Ollama Provider                                       │
└───────────────────────────────────────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────────────┐
│               Presentation Layer                      │
│                                                       │
│ VS Code Webview                                       │
│ CLI Output                                            │
│ JSON API                                               │
└───────────────────────────────────────────────────────┘

---

# Architectural Goals

The architecture must satisfy the following goals.

✓ Platform Independent

✓ AI Provider Independent

✓ IDE Independent

✓ Highly Modular

✓ Testable

✓ Replaceable Components

✓ Future Compatible

---

# Dependency Rule

Dependencies always flow inward.

Presentation

↓

Commands

↓

Services

↓

Investigation Engine

↓

Interfaces

↓

Utilities

Nothing inside the engine may depend on VS Code.

---

# Client Layer

The client layer is responsible only for collecting information from the environment.

Examples

VS Code

CLI

JetBrains

PowerShell

GitHub Actions

Responsibilities

Collect context

Trigger investigation

Render result

Nothing else.

No investigation logic belongs here.

---

# Context Collection Layer

The collectors convert IDE-specific APIs into a standard Beacon Context object.

Collectors

Editor Collector

Workspace Collector

Project Collector

Terminal Collector

Environment Collector

Framework Collector

Every collector is independent.

Collectors never analyze.

Collectors never call AI.

Collectors never make decisions.

---

# Context Object

Every client must produce exactly the same Context object.

The engine should never know where the request originated.

Whether the request comes from

VS Code

CLI

JetBrains

GitHub Actions

the Context object remains identical.

---

# Investigation Engine

This is the heart of Beacon.

Every investigation follows the same pipeline.

Collect Context

↓

Normalize Context

↓

Static Analysis

↓

Rule Engine

↓

Known Solution Cache

↓

AI Investigation

↓

Evidence Builder

↓

Investigation Report

No step may be skipped.

---

# Context Normalizer

Purpose

Convert every Context into a standardized structure.

Responsibilities

Normalize file paths

Normalize operating systems

Normalize package managers

Normalize framework names

Normalize terminal output

Normalize language detection

Output

NormalizedContext

---

# Static Analyzer

The Static Analyzer detects deterministic issues.

Examples

Missing npm dependency

Broken import

Missing alias

Port occupied

Wrong interpreter

Configuration mismatch

Missing environment variable

The Static Analyzer never calls AI.

---

# Rule Engine

The Rule Engine contains deterministic rules.

Example

IF

Import exists

AND

Package missing

THEN

Missing Dependency

Confidence

100%

Another example

IF

Port

3000

already occupied

THEN

Port Conflict

Confidence

100%

---

# Known Solution Cache

Before AI executes

Beacon checks

Have we solved this before?

↓

YES

↓

Return Cached Investigation

↓

NO

↓

Continue

Cache keys

Framework

Language

Error Signature

Configuration Hash

---

# AI Investigation Layer

Only receives investigations that cannot be solved locally.

Responsibilities

Reason over evidence

Generate root cause

Rank hypotheses

Estimate confidence

Suggest fixes

Return structured JSON

The AI never receives the entire project.

Only relevant files.

---

# Evidence Builder

Every investigation requires evidence.

Evidence sources

Static Rules

Configuration

Dependencies

Project Metadata

AI Findings

Evidence is attached to every diagnosis.

Example

Evidence

✓ package.json missing dependency

✓ Import exists

✓ Build failed after npm install

Confidence

97%

---

# Investigation Builder

Produces the final Investigation object.

The Presentation Layer consumes this object.

The UI should never interpret AI responses directly.

---

# Presentation Layer

Responsible only for rendering.

Never performs analysis.

Never calls AI.

Never collects context.

Clients

VS Code

CLI

Future Dashboard

---

# Module Responsibilities

collectors/

Collect data only.

---

analyzers/

Static diagnostics only.

---

engine/

Coordinates investigation.

---

providers/

External services.

---

schema/

Shared interfaces.

---

services/

Business logic.

---

webview/

Rendering only.

---

commands/

VS Code command registration.

---

utils/

Reusable helper functions.

---

# Future Clients

The architecture must support

VS Code

Cursor

JetBrains

CLI

PowerShell

CMD

GitHub Actions

Docker

GitLab CI

without changing the engine.

Only new collectors should be required.

---

# Threading Model

All investigations execute asynchronously.

Never block

VS Code

UI Thread

Long-running operations must support cancellation.

---

# Caching Strategy

Cache

Static Analysis

Framework Detection

Project Metadata

AI Investigations

Do not cache

Terminal Output

Current Selection

Stack Trace

---

# Error Handling

Every layer returns Result<T, Error>

Never throw uncaught exceptions.

Every error should include

Type

Message

Source

Recoverability

---

# Logging Strategy

Every stage logs

Investigation Started

↓

Context Collected

↓

Normalization Complete

↓

Static Analysis Complete

↓

AI Started

↓

AI Finished

↓

Evidence Built

↓

Rendered

Never log

Secrets

Environment variables

Tokens

Passwords

---

# Security Model

Never upload

node_modules

.git

dist

build

.env

private keys

credentials

SSH keys

Only upload

Current file

Configuration

Relevant metadata

Selected code

Terminal output

Stack trace

---

# Scalability

The Investigation Engine should remain completely reusable.

Future integrations should require only

A new Context Collector

and

A new Renderer.

The Engine should remain untouched.

---

# Architecture Principle

Beacon should never become

A VS Code Extension.

Beacon should become

A Universal Investigation Engine

with multiple clients.

The extension is only the first client.
