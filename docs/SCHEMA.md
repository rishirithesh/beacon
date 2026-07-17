# SCHEMA.md

# Beacon Shared Schema Specification

Version: 1.0

---

# Purpose

Beacon is composed of multiple independent modules.

Modules never communicate through implementation.

Modules communicate only through strongly typed schemas.

Every client

VS Code

CLI

JetBrains

GitHub Actions

must produce identical schema objects.

The Investigation Engine should never know which client generated them.

---

# Naming Rules

Interfaces

PascalCase

Example

Investigation

Context

Evidence

AnalyzerResult

Enums

PascalCase

Fields

camelCase

IDs

UUID v4

Timestamps

ISO 8601

---

# Investigation

The Investigation is the final output produced by Beacon.

Every investigation returns exactly one Investigation object.

```ts
interface Investigation {

    id: string;

    version: string;

    createdAt: string;

    duration: number;

    status: InvestigationStatus;

    summary: Summary;

    rootCause: RootCause;

    evidence: Evidence[];

    fixes: Fix[];

    commands: Command[];

    affectedFiles: FileReference[];

    warnings: Warning[];

    metadata: InvestigationMetadata;

}
```

---

# Investigation Status

```ts
enum InvestigationStatus {

Pending,

CollectingContext,

RunningStaticAnalysis,

RunningRules,

Investigating,

BuildingEvidence,

Completed,

Cancelled,

Failed

}
```

---

# Summary

```ts
interface Summary {

title: string;

description: string;

confidence: number;

estimatedFixTime: string;

severity: Severity;

}
```

---

# Severity

```ts
enum Severity {

Info,

Low,

Medium,

High,

Critical

}
```

---

# Root Cause

```ts
interface RootCause {

title: string;

description: string;

confidence: number;

source: RootCauseSource;

}
```

---

# Root Cause Source

```ts
enum RootCauseSource {

StaticAnalysis,

RuleEngine,

Cache,

AI

}
```

---

# Evidence

Every conclusion requires evidence.

```ts
interface Evidence {

id: string;

title: string;

description: string;

source: EvidenceSource;

confidence: number;

severity: Severity;

relatedFile?: string;

lineNumber?: number;

}
```

---

# Evidence Source

```ts
enum EvidenceSource {

Dependency,

Configuration,

Environment,

Import,

File,

Terminal,

StackTrace,

Framework,

AI

}
```

---

# Fix

```ts
interface Fix {

title: string;

description: string;

priority: number;

estimatedTime: string;

requiresRestart: boolean;

}
```

---

# Command

```ts
interface Command {

label: string;

command: string;

platform: Platform;

copyable: boolean;

}
```

---

# Platform

```ts
enum Platform {

CrossPlatform,

Windows,

Linux,

MacOS

}
```

---

# File Reference

```ts
interface FileReference {

path: string;

line?: number;

column?: number;

reason: string;

}
```

---

# Warning

```ts
interface Warning {

title: string;

description: string;

severity: Severity;

}
```

---

# Investigation Metadata

```ts
interface InvestigationMetadata {

framework: string;

language: string;

runtime: string;

packageManager: string;

provider: string;

staticAnalysisDuration: number;

aiDuration: number;

totalDuration: number;

}
```

---

# Context

The Context object is the most important schema.

Every client generates this.

```ts
interface Context {

workspace: Workspace;

editor: EditorContext;

terminal: TerminalContext;

project: ProjectContext;

environment: EnvironmentContext;

configuration: ConfigurationContext;

}
```

---

# Workspace

```ts
interface Workspace {

rootPath: string;

name: string;

folders: string[];

}
```

---

# Editor Context

```ts
interface EditorContext {

currentFile: string;

language: string;

selection?: string;

cursorLine: number;

cursorColumn: number;

}
```

---

# Terminal Context

```ts
interface TerminalContext {

command: string;

stdout: string;

stderr: string;

exitCode: number;

}
```

---

# Project Context

```ts
interface ProjectContext {

framework: string;

dependencies: Dependency[];

files: ProjectFile[];

}
```

---

# Dependency

```ts
interface Dependency {

name: string;

version: string;

type: DependencyType;

}
```

---

# Dependency Type

```ts
enum DependencyType {

Runtime,

Development

}
```

---

# Project File

```ts
interface ProjectFile {

path: string;

hash: string;

size: number;

}
```

---

# Environment

```ts
interface EnvironmentContext {

os: string;

nodeVersion?: string;

pythonVersion?: string;

javaVersion?: string;

runtime: string;

packageManager: string;

}
```

---

# Configuration

```ts
interface ConfigurationContext {

tsconfig?: string;

packageJson?: string;

requirements?: string;

cargo?: string;

pubspec?: string;

dockerCompose?: string;

nextConfig?: string;

viteConfig?: string;

}
```

---

# Analyzer Result

Every analyzer returns the same object.

```ts
interface AnalyzerResult {

success: boolean;

confidence: number;

findings: Evidence[];

fixes: Fix[];

warnings: Warning[];

}
```

---

# Rule Result

```ts
interface RuleResult {

matched: boolean;

ruleId: string;

confidence: number;

investigation?: Investigation;

}
```

---

# AI Request

```ts
interface AIRequest {

context: Context;

knownEvidence: Evidence[];

knownFindings: AnalyzerResult[];

}
```

---

# AI Response

```ts
interface AIResponse {

rootCause: RootCause;

evidence: Evidence[];

fixes: Fix[];

commands: Command[];

warnings: Warning[];

confidence: number;

}
```

---

# Cache Entry

```ts
interface CacheEntry {

hash: string;

investigation: Investigation;

createdAt: string;

expiresAt: string;

}
```

---

# Provider Interface

Every AI provider must implement

```ts
interface AIProvider {

initialize(): Promise<void>;

investigate(request: AIRequest): Promise<AIResponse>;

healthCheck(): Promise<boolean>;

estimateTokens(request: AIRequest): number;

}
```

---

# Collector Interface

Every collector implements

```ts
interface Collector<T> {

collect(): Promise<T>;

}
```

---

# Analyzer Interface

Every analyzer implements

```ts
interface Analyzer {

analyze(context: Context): Promise<AnalyzerResult>;

}
```

---

# Renderer Interface

```ts
interface Renderer {

render(investigation: Investigation): Promise<void>;

}
```

---

# Versioning

Schemas must be backward compatible.

Never remove fields.

Only

Add

Deprecate

Version

---

# Serialization

Every schema

must be serializable to

JSON.

Never include

Functions

Classes

Circular references

---

# Golden Rule

Every layer inside Beacon communicates only through schemas.

Schemas are the language of the system.

Changing a schema is an architectural change.

Every schema modification requires

Documentation update

Version increment

Migration consideration
