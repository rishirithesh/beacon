# UI_GUIDELINES.md

# Beacon UI & Design System

Version: 1.0

---

# Philosophy

Beacon is not a chatbot.

Beacon is not a dashboard.

Beacon is not another AI application.

Beacon is an engineering tool.

The interface should communicate

calmness

confidence

clarity

precision

Every component should reduce cognitive load.

Developers should focus on understanding problems.

Never on understanding the interface.

---

# Design Inspiration

The visual language should be inspired by

Linear

Raycast

Cursor

GitHub

Vercel

Arc Browser

Notion

VS Code Native UI

Do NOT imitate ChatGPT.

Do NOT imitate Discord.

Do NOT imitate Slack.

Do NOT imitate consumer AI products.

---

# Visual Personality

Beacon should feel

Minimal

Technical

Professional

Confident

Elegant

Fast

Invisible

It should never feel playful.

---

# Color Philosophy

Color exists only to communicate state.

Never decorate.

Never add gradients for aesthetics.

Every color must have meaning.

---

# Primary Accent

Blue

Purpose

Investigation

Analysis

Information

---

# Success

Green

Purpose

Confirmed findings

Successful investigation

---

# Warning

Amber

Purpose

Potential issues

Configuration warnings

Partial confidence

---

# Error

Red

Purpose

Critical failures

Investigation errors

Missing context

---

# Neutral

Gray

Purpose

Structure

Cards

Borders

Secondary text

---

# Typography

Primary Font

VS Code Default

Fallback

Inter

System UI

Never use decorative fonts.

---

# Font Scale

Title

24px

Heading

18px

Section

16px

Body

14px

Caption

12px

Code

13px

---

# Layout

Beacon follows a single-column reading experience.

The investigation should read like a report.

Not like a dashboard.

---

# Page Structure

Header

↓

Investigation Status

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

Metadata

---

# Spacing

Use an 8-point grid.

Spacing

4

8

16

24

32

48

Never use arbitrary spacing.

---

# Border Radius

Subtle.

Maximum

8px

Never use pill-shaped cards.

---

# Shadows

Very subtle.

Prefer borders over shadows.

The interface should feel flat.

---

# Cards

Every section is its own card.

Cards

Root Cause

Evidence

Commands

Warnings

Files

Metadata

Each card has

Title

Content

Optional Actions

---

# Root Cause Card

Contains

Title

One sentence summary

Confidence

Severity

Estimated Fix Time

Most important card.

Always appears first.

---

# Confidence Card

Visualize confidence.

High

Green

Medium

Amber

Low

Red

Never use percentages alone.

Combine

Confidence

+

Evidence Count

---

# Evidence Card

Every evidence item contains

Title

Description

Source

Confidence

Severity

Related File

Evidence should be readable independently.

---

# Fix Card

Contains

Step-by-step actions.

One action per row.

Never long paragraphs.

Example

1.

Install dependency

2.

Restart TypeScript server

3.

Rebuild project

---

# Commands Card

Each command has

Copy Button

Syntax Highlighting

Platform Label

Example

npm

pnpm

yarn

Windows

Linux

Mac

---

# Files Card

Shows

Affected Files

Clickable

Open in editor

Highlight affected lines when possible.

---

# Metadata Card

Contains

Framework

Language

Package Manager

Runtime

Duration

AI Provider

Static Analysis Time

Investigation Time

---

# Investigation Status

Every investigation has a status.

Collecting Context

Analyzing

Investigating

Building Evidence

Rendering

Completed

Cancelled

Failed

---

# Loading State

Never show spinners only.

Always explain progress.

Example

Collecting project metadata...

Running dependency analysis...

Comparing configuration...

Investigating unknown issues...

Building report...

---

# Empty State

When no investigation exists.

Show

Beacon

Understand the cause,

not the symptom.

[ Investigate ]

Minimal.

---

# Error State

Never expose stack traces.

Show

Investigation Failed

↓

Reason

↓

Suggested Action

↓

Retry

---

# Buttons

Primary

Investigate

Retry

Copy Commands

Secondary

Open File

View Evidence

Expand

Never exceed two primary actions.

---

# Icons

Use Lucide Icons.

Consistent stroke width.

Examples

Search

Investigation

Warning

File

Folder

Terminal

Package

Bug

Sparkles (AI)

Clock

Shield

---

# Motion

Animations should communicate progress.

Maximum duration

200ms

No bouncing.

No flashy transitions.

Fade

Slide

Scale

Only.

---

# Scroll Behaviour

Investigation should scroll naturally.

Header remains visible.

Navigation stays fixed.

---

# Theme

Dark Mode first.

Light Mode supported.

Respect VS Code theme variables whenever possible.

Do not hardcode colors.

---

# Accessibility

Keyboard navigable.

Screen reader labels.

High contrast.

Visible focus rings.

ARIA labels.

Semantic HTML.

Required.

---

# Microinteractions

Hover

Subtle elevation.

Click

Immediate feedback.

Copy

Toast

Investigation Complete

Notification

Everything should feel responsive.

---

# Design Principles

Every screen should answer

What happened?

Why?

What should I do?

How confident is Beacon?

Nothing else.

---

# What Beacon Is NOT

No chat bubbles.

No avatars.

No conversations.

No prompt boxes.

No markdown viewers.

No AI typing animations.

No giant glowing buttons.

No gradient overload.

No neon themes.

No gamer aesthetics.

No hackathon UI.

---

# Final Design Principle

A developer should feel

calm

the moment Beacon opens.

The interface should inspire confidence.

Not excitement.

Engineers use Beacon to solve problems.

The UI should get out of the way.
