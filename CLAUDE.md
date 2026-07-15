# CLAUDE.md

# Beacon AI Engineering Constitution

Version: 1.0

This document defines the engineering rules that every AI coding agent must follow while contributing to Beacon.

These rules take precedence over implementation preferences.

Violation of these rules is considered a bug.

---

# Project Identity

Beacon is NOT

- an AI chatbot
- an AI wrapper
- another ChatGPT UI
- a debugging assistant

Beacon IS

A context-aware diagnostics engine.

Its purpose is to investigate software failures by collecting evidence before performing reasoning.

Every implementation decision must reinforce this identity.

---

# Mission

Beacon should behave like an experienced Staff Software Engineer.

It should never immediately answer a question.

Instead it should investigate.

Every investigation should answer

"What actually caused this?"

instead of

"What does this error mean?"

---

# Core Principles

## Principle 1

Context Before Intelligence.

Context is Beacon's competitive advantage.

Never ask the developer for information that Beacon can automatically collect.

Always prefer automatic context collection.

---

## Principle 2

Evidence Before Explanation.

Never generate conclusions without evidence.

Every investigation must contain

Evidence

Confidence

Root Cause

Fix

Affected Files

Estimated Time

If evidence cannot be gathered

Return

Insufficient Evidence

instead of hallucinating.

---

## Principle 3

Static Analysis Before AI.

The investigation pipeline must always be

Context Collection

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

The AI layer must never execute first.

---

## Principle 4

Thin Clients.

VS Code should only collect context.

The engine performs analysis.

The UI only renders results.

Business logic must never exist inside UI components.

---

## Principle 5

Everything Is Replaceable.

Every module must be abstracted.

Examples

Gemini

↓

AIProvider

VS Code

↓

ContextProvider

React

↓

Renderer

Nothing should depend on a concrete implementation.

---

# Architecture Rules

Beacon follows Clean Architecture.

Allowed dependencies

UI

↓

Commands

↓

Services

↓

Engine

↓

Interfaces

↓

Utilities

Never reverse this dependency direction.

---

# Folder Ownership

src/

commands/

Only command registration.

Never perform analysis here.

---

collectors/

Only collect information.

Never analyze.

Never call AI.

---

analyzers/

Only local diagnostics.

No network calls.

No UI.

---

engine/

Coordinates investigation.

Never contains VS Code API.

Must remain platform independent.

---

providers/

External integrations.

Gemini

OpenAI

Claude

Ollama

Future providers belong here.

---

webview/

Presentation only.

No business logic.

---

schema/

Shared models.

Never place interfaces elsewhere.

---

utils/

Reusable helpers.

Never import UI.

---

# Investigation Pipeline

Every investigation must follow

1

Collect Context

↓

2

Normalize Context

↓

3

Run Static Rules

↓

4

Run Known Pattern Matching

↓

5

Consult Cache

↓

6

AI Investigation

↓

7

Evidence Builder

↓

8

Investigation Report

Never skip steps.

---

# AI Rules

The LLM is the last resort.

Never use AI when

Missing dependency

Missing file

Port occupied

Known configuration issue

Alias missing

Missing environment variable

Known framework problem

can be solved locally.

---

Never ask AI to

guess.

Instead ask AI to

investigate.

---

Prompt Style

Always request JSON.

Never markdown.

Never paragraphs.

Never conversational output.

---

Every AI response must include

Root Cause

Evidence

Confidence

Affected Files

Fix

Commands

Estimated Time

Potential Side Effects

---

# Context Collection Rules

Collect only what is required.

Allowed

Current file

Selection

Stack trace

Terminal output

package.json

Configuration

Environment metadata

Framework

Workspace metadata

Forbidden

node_modules

.git

build

dist

.env contents

private keys

tokens

passwords

API keys

Never upload secrets.

---

# Performance Rules

Never block the VS Code UI.

All analysis must be asynchronous.

Cancellation tokens must be respected.

Large files should be streamed.

Repeated investigations should use cache.

Never analyze unchanged files twice.

---

# TypeScript Rules

Strict mode enabled.

No

any

No

ts-ignore

No duplicated logic.

Prefer interfaces.

Prefer composition.

Never create utility god classes.

---

# Error Handling

Every async operation must

try

catch

Errors must be typed.

Never silently swallow exceptions.

Every failure must produce

Recoverable

User Friendly

Logs

---

# Logging

Every major stage should log

Investigation Started

Context Collected

Static Analysis Completed

AI Started

AI Completed

Evidence Built

Render Complete

Logs should never contain secrets.

---

# Security

Never execute user code.

Never automatically apply fixes.

Never modify project files without explicit user confirmation.

Never upload unnecessary files.

Always sanitize prompts.

---

# UI Principles

No chatbot.

No conversation history.

No prompt box.

Beacon performs investigations.

The UI should resemble

Linear

Raycast

Cursor

Vercel

Minimal.

Professional.

Fast.

---

# Code Quality

Every file should have one responsibility.

Maximum preferred file size

300 lines

Split aggressively.

Prefer dependency injection.

Never tightly couple modules.

---

# Future Compatibility

The engine must support

VS Code

Cursor

JetBrains

CLI

PowerShell

CMD

Terminal

GitHub Actions

Docker

without architectural changes.

The engine must never import VS Code APIs.

---

# Testing Requirements

Every analyzer requires tests.

Every collector requires tests.

Every parser requires tests.

Mock external providers.

Never call real AI during unit tests.

---

# Commit Philosophy

Every commit should leave the project in a working state.

Never introduce TODO placeholders.

Never commit dead code.

Every feature should compile.

---

# Documentation Rules

Documentation is part of the product.

Whenever architecture changes

Update

ARCHITECTURE.md

Whenever schemas change

Update

SCHEMA.md

Whenever prompts change

Update

PROMPTS.md

Documentation must never drift from implementation.

---

# AI Development Workflow

Before writing code

Read

README.md

PRODUCT.md

ARCHITECTURE.md

ENGINE_SPEC.md

EXTENSION_SPEC.md

SCHEMA.md

PROMPTS.md

ROADMAP.md

Only then begin implementation.

Never invent architecture that contradicts the documentation.

---

# Final Principle

Beacon exists to answer one question.

"What is the most probable root cause of this failure?"

Everything else is secondary.

When in doubt

Prefer investigation over explanation.

Prefer evidence over confidence.

Prefer simplicity over cleverness.
