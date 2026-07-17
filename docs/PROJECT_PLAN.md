# PROJECT_PLAN.md

# Beacon Development Blueprint

Version: 1.0

Status

Planning Complete

Current Phase

Implementation

---

# Objective

Transform Beacon from documentation into a production-ready VS Code extension.

The implementation follows an iterative approach.

Every milestone produces a working application.

Never build everything at once.

---

# Overall Timeline

Phase 0

Documentation

↓

Phase 1

Repository Setup

↓

Phase 2

Core Packages

↓

Phase 3

Investigation Engine

↓

Phase 4

VS Code Extension

↓

Phase 5

Static Analysis

↓

Phase 6

AI Integration

↓

Phase 7

UI Polish

↓

Phase 8

Testing

↓

Phase 9

Marketplace Beta

↓

Phase 10

Public Release

---

# Phase 1

Repository Setup

Duration

1 Day

Tasks

Create monorepo

Configure pnpm workspaces

Configure TypeScript

Configure ESLint

Configure Prettier

Configure GitHub Actions

Create package structure

Deliverable

Empty project builds successfully.

---

# Phase 2

Shared Packages

Duration

2 Days

Packages

schema

shared

engine

collectors

analyzers

providers

Tasks

Define interfaces

Export schemas

Build utilities

Setup dependency graph

Deliverable

Packages compile independently.

---

# Phase 3

Investigation Engine

Duration

3 Days

Modules

Context Normalizer

Rule Engine

Evidence Builder

Confidence Builder

Investigation Builder

Cache

Deliverable

Engine accepts Context.

Engine returns Investigation.

No AI.

---

# Phase 4

VS Code Extension

Duration

3 Days

Tasks

Commands

Sidebar

Webview

Message Bus

Secret Storage

Settings

Deliverable

Clicking Investigate returns a static Investigation Report.

---

# Phase 5

Static Analysis

Duration

4 Days

Analyzers

Dependency

Import

Configuration

Environment

Port

File

Deliverable

Engine detects common issues locally.

No AI required.

---

# Phase 6

AI Integration

Duration

3 Days

Tasks

Gemini Provider

Prompt Builder

JSON Validation

Retry Logic

Fallback

Confidence Merge

Deliverable

Static + AI investigation working.

---

# Phase 7

User Interface

Duration

3 Days

Tasks

Cards

Animations

Loading States

Empty States

Error States

Theme Support

Accessibility

Deliverable

Production-quality UI.

---

# Phase 8

Testing

Duration

3 Days

Tasks

Unit Tests

Integration Tests

Extension Tests

Performance Tests

Manual Testing

Deliverable

Stable Beta.

---

# Phase 9

Marketplace Beta

Duration

2 Days

Tasks

README

Logo

Screenshots

GIF

Marketplace Listing

Versioning

Deliverable

Private Beta.

---

# Phase 10

Launch

Tasks

Bug Fixes

Performance

Documentation

Public Marketplace Release

Version

0.1.0

---

# Milestones

Milestone 1

Architecture Complete

Milestone 2

Core Engine Complete

Milestone 3

VS Code Extension Complete

Milestone 4

Static Analysis Complete

Milestone 5

AI Integration Complete

Milestone 6

Testing Complete

Milestone 7

Marketplace Beta

Milestone 8

Version 0.1

---

# Definition of Done

A milestone is complete only if

Build succeeds

Tests pass

Documentation updated

No critical bugs

Code reviewed

---

# Development Principles

Implement one module at a time.

Never skip testing.

Never bypass schemas.

Never couple the engine to VS Code.

AI is always the final step.

---

# End Goal

Beacon should become the fastest way for a developer to understand why their software failed.

Understand the cause,

not the symptom.
