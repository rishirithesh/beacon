import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeContext } from '../src/engine/contextNormalizer';
import { ContextValidationError, validateContextOrThrow } from '../src/engine/contextValidator';
import { detectFramework } from '../src/engine/frameworkDetector';
import { buildInvestigationReport } from '../src/engine/investigationBuilder';
import { InvestigationContext } from '../src/schema/investigation';

function makeContext(overrides: Partial<InvestigationContext> = {}): InvestigationContext {
  return {
    file: {
      path: 'src/app.ts',
      languageId: 'TypeScript',
      selection: null,
      fullContentSnippet: 'const value = 1;',
    },
    stackTrace: 'Error: Cannot find module \'react\'',
    terminalOutput: null,
    manifests: [
      {
        kind: 'package.json',
        path: 'package.json',
        contentSnippet: '{"name":"demo","dependencies":{"react":"18.0.0"}}',
      },
    ],
    environment: {
      nodeVersion: 'v20.11.0',
      pythonVersion: null,
      packageManager: 'NPM',
      operatingSystem: 'win32 10',
    },
    workspace: {
      rootPath: 'C:/workspace',
      frameworks: [],
      primaryLanguage: 'TypeScript',
    },
    collectedAt: new Date().toISOString(),
    ...overrides,
  };
}

test('normalizeContext standardizes paths, languages, and package managers', () => {
  const normalized = normalizeContext(makeContext());

  assert.equal(normalized.file.path, 'src/app.ts');
  assert.equal(normalized.file.languageId, 'typescript');
  assert.equal(normalized.environment.packageManager, 'npm');
  assert.equal(normalized.environment.operatingSystem, 'windows');
});

test('validateContextOrThrow rejects empty context', () => {
  assert.throws(() => validateContextOrThrow({
    file: { path: '', languageId: '', selection: null, fullContentSnippet: null },
    stackTrace: null,
    terminalOutput: null,
    manifests: [],
    environment: { nodeVersion: null, pythonVersion: null, packageManager: 'unknown', operatingSystem: 'unknown' },
    workspace: { rootPath: null, frameworks: [], primaryLanguage: null },
    collectedAt: new Date().toISOString(),
  }), (error: unknown) => error instanceof ContextValidationError);
});

test('detectFramework identifies React from package metadata', () => {
  const detection = detectFramework(makeContext());

  assert.equal(detection.framework, 'react');
  assert.ok(detection.confidence >= 70);
});

test('buildInvestigationReport creates a low-confidence fallback report when evidence is insufficient', () => {
  const report = buildInvestigationReport({
    context: makeContext(),
    framework: 'react',
    source: 'insufficient-evidence',
    ruleId: null,
    rootCause: 'No deterministic issue matched the available evidence.',
    evidence: [],
    confidence: 18,
    fixSteps: ['Try collecting more terminal output or a stack trace before investigating again.'],
    commands: [],
    affectedFiles: ['src/app.ts'],
    estimatedFixTime: 'unknown',
    potentialSideEffects: [],
  });

  assert.equal(report.source, 'ai');
  assert.ok(report.confidence <= 35);
  assert.ok(report.evidence.length >= 1);
  assert.ok(report.affectedFiles.includes('src/app.ts'));
});
