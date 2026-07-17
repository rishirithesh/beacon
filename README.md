# Beacon

> **Understand the cause, not the symptom.**

Beacon is a context-aware diagnostics engine for developers.

Unlike traditional AI coding assistants, Beacon does not begin with a question.

It begins with evidence.

Beacon automatically investigates project context, runtime information, configuration files, dependencies, build output, and editor state before performing AI reasoning.

The result is a structured investigation that identifies the most likely root cause of a problem rather than simply explaining an error message.

---

# Vision

Modern AI assistants are incredibly intelligent.

However, they still require developers to manually provide context.

Typical debugging looks like this:

Error

↓

Copy Stack Trace

↓

Open ChatGPT

↓

Paste Error

↓

Paste package.json

↓

Paste code

↓

Paste terminal output

↓

Paste configuration

↓

Receive answer

Beacon removes that entire workflow.

The extension understands the project before investigation begins.

Instead of explaining symptoms, Beacon investigates causes.

---

# Philosophy

Beacon follows four principles.

## Context First

Developers should never manually provide information that Beacon can automatically collect.

Context is collected silently and securely.

---

## Evidence Over Guesses

Every investigation must explain why Beacon reached a conclusion.

Beacon never guesses.

Each diagnosis must reference concrete evidence gathered from the project.

Example

Evidence

✓ package.json updated

✓ TypeScript alias missing

✓ Build failed immediately after dependency installation

Confidence

94%

---

## AI Is The Final Step

Beacon is not an AI wrapper.

Every investigation follows this pipeline.

Collect Context

↓

Static Analysis

↓

Rule Engine

↓

Known Solution Cache

↓

AI Investigation (only if required)

↓

Evidence Builder

↓

Investigation Report

---

## Native Experience

Beacon should feel like an official VS Code feature.

No chatbot.

No conversations.

No prompts.

No message history.

Only investigations.

---

# MVP

Version 0.1 focuses on one capability.

Investigate Error.

Workflow

Developer encounters an error.

↓

Click

Investigate

↓

Beacon gathers

Current editor

Workspace

Project metadata

Terminal output

Stack trace

Configuration

Environment

↓

Run local diagnostics

↓

If root cause discovered

↓

Return investigation

↓

Otherwise

↓

AI investigation

↓

Render investigation report

---

# Features

Version 0.1

✓ Context Collection

✓ Static Analysis

✓ Rule Engine

✓ Gemini Integration

✓ Evidence Builder

✓ Investigation Dashboard

✓ Settings

✓ API Key Management

Future

• CLI

• Terminal

• PowerShell

• CMD

• JetBrains

• Cursor

• Docker

• GitHub Actions

• AI Patch Generation

---

# Project Structure

beacon/

README.md

CLAUDE.md

docs/

PRODUCT.md

ARCHITECTURE.md

ENGINE_SPEC.md

EXTENSION_SPEC.md

UI_GUIDELINES.md

SCHEMA.md

PROMPTS.md

ROADMAP.md

extension/

website/

---

# Technology Stack

Extension

TypeScript

VS Code Extension API

React

TailwindCSS

Vite

Webview API

Validation

Zod

AI

Gemini

Architecture

Clean Architecture

Performance

Caching

Async Tasks

Lazy Context Collection

---

# Development

Requirements

Node.js 22+

pnpm

VS Code

Git

Install

pnpm install

Development

pnpm dev

Package Extension

pnpm package

---

# Repository Rules

Every feature begins with documentation.

Architecture changes require documentation updates.

No feature should violate PRODUCT.md.

No implementation should violate CLAUDE.md.

The documentation is the source of truth.

---

# Guiding Principle

Beacon should behave like an experienced senior engineer.

It should investigate.

Not guess.

Not explain.

Investigate.
