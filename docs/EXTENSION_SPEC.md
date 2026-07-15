# EXTENSION_SPEC.md

# Beacon VS Code Extension Specification

Version: 1.0

---

# Purpose

Beacon is a first-class VS Code extension.

Its responsibility is to

- Observe
- Collect Context
- Trigger Investigations
- Display Results

The extension never performs investigation logic.

The Investigation Engine performs all reasoning.

---

# Design Philosophy

Beacon should feel like it was developed by the VS Code team.

Not a web application inside VS Code.

Not an AI chatbot.

Not another sidebar full of prompts.

Every interaction should be intentional.

Fast.

Minimal.

Professional.

---

# Extension Identity

Name

Beacon

Publisher

Beacon Labs

Category

Developer Tools

Keywords

Debugging

Diagnostics

AI

Context

Root Cause

Investigation

---

# Activation Events

The extension should activate when

Workspace Opens

Command Executed

Beacon Sidebar Opened

Settings Changed

Investigation Requested

Never activate unnecessarily.

---

# Extension Lifecycle

VS Code Starts

↓

Beacon Loads

↓

Register Commands

↓

Register Sidebar

↓

Initialize Engine

↓

Load Settings

↓

Load Cached Metadata

↓

Ready

---

# Extension Architecture

Extension

↓

Commands

↓

Context Collectors

↓

Engine Service

↓

Renderer

↓

Webview

Business logic must never exist inside commands.

---

# Commands

Version 0.1 contains only three commands.

---

## Beacon: Investigate Error

Primary command.

Workflow

Collect Context

↓

Run Investigation

↓

Open Investigation Panel

---

## Beacon: Analyze Current File

Runs investigation using only

Current File

Workspace

Configuration

Useful before runtime errors occur.

---

## Beacon: Explain Selected Code

Uses selected code as primary evidence.

Still performs project investigation.

Never behaves like ChatGPT.

---

# Activity Bar

Beacon owns a dedicated Activity Bar icon.

Opening Beacon shows

Recent Investigation

Investigate Button

Project Summary

AI Provider

Settings Shortcut

Future

History

Sessions

Pinned Investigations

---

# Investigation Panel

The Investigation Panel is a Webview.

It displays

Summary

↓

Root Cause

↓

Confidence

↓

Evidence

↓

Affected Files

↓

Fix Steps

↓

Commands

↓

Warnings

↓

Estimated Time

↓

Copy Actions

Never display raw AI output.

Always display Investigation objects.

---

# Investigation Flow

User clicks

Investigate

↓

Collect Context

↓

Show Progress

↓

Running Static Analysis

↓

Running Investigation

↓

Building Report

↓

Display Investigation

Every stage must be visible.

---

# Progress Indicators

Collecting Context

Analyzing Project

Running Rules

Investigating

Building Evidence

Rendering

Completed

---

# Notifications

Use notifications sparingly.

Allowed

Investigation Complete

API Key Missing

AI Provider Unavailable

Large Workspace

Never spam users.

---

# Status Bar

Optional

Displays

Beacon Ready

Investigating...

AI Offline

Static Analysis Only

Clicking opens Beacon.

---

# Settings

Beacon contributes a settings section.

Settings

AI Provider

Gemini API Key

Enable AI

Enable Static Analysis

Enable Cache

Verbose Logging

Privacy Mode

Telemetry

Theme

Maximum Context Size

Investigation Timeout

---

# API Key Storage

Use

VS Code SecretStorage

Never store API keys

in files

settings.json

workspace

or plaintext.

---

# Workspace State

Store

Last Investigation

Framework

Language

Project Hash

Investigation Cache

Never store

Source Code

Secrets

---

# Global State

Store

Theme

Provider

Preferences

Telemetry Consent

Recent Projects

---

# Context Collection

Collected Automatically

Current File

Selected Code

Workspace

Terminal Output

Stack Trace

Framework

Configuration

Language

Package Manager

Operating System

Runtime Version

Collected On Demand

Additional Files

Future

Git History

CI Logs

Docker Logs

---

# Supported Languages

Initial

TypeScript

JavaScript

Python

Java

Go

Rust

Dart

Future

C#

C++

PHP

Ruby

Swift

Kotlin

---

# Supported Frameworks

React

Next.js

Node

Express

NestJS

Vue

Angular

FastAPI

Flask

Django

Flutter

Spring Boot

Laravel

Rails

Go

Rust

---

# Privacy

Beacon never uploads

node_modules

.git

dist

build

.env

credentials

tokens

private keys

Only

Relevant Context

is transmitted.

Privacy must always be visible.

Users should understand

what Beacon is sending.

---

# Investigation Session

Every investigation creates

one Investigation Session.

A session contains

Timestamp

Context

Evidence

Result

Confidence

Provider

Duration

Future versions

will compare sessions.

---

# Webview Communication

Extension

↓

Message Bus

↓

Webview

↓

User Interaction

↓

Extension

No direct coupling.

Use typed messages.

---

# Keyboard Shortcuts

Default

Ctrl + Shift + I

Investigate

Future

Ctrl + Shift + B

Open Beacon

---

# Error Handling

Missing API Key

↓

Show Settings

↓

Do not crash

No Workspace

↓

Disable Investigation

AI Timeout

↓

Retry

↓

Fallback

↓

Static Investigation

---

# Performance Goals

Extension Activation

< 300ms

Context Collection

< 100ms

UI Response

Instant

Investigation

< 6 seconds

---

# Accessibility

Keyboard Navigation

High Contrast

Screen Reader Labels

Focus Management

Semantic HTML

Required.

---

# Marketplace Assets

Required

Logo

Banner

Screenshots

Demo GIF

README

CHANGELOG

LICENSE

Privacy Policy

Support URL

Repository URL

Issue Tracker

---

# Future Extension Features

Automatic Error Detection

Terminal Monitoring

Git Investigation

Project Memory

One Click Fix

Investigation History

Pinned Investigations

CLI Integration

JetBrains Integration

Docker Diagnostics

---

# Success Criteria

A developer should be able to

Install Beacon

↓

Encounter an error

↓

Click Investigate

↓

Understand the root cause

↓

Fix the issue

↓

Never leave VS Code

That is the entire purpose of the extension.
