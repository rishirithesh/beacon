import test from 'node:test';
import assert from 'node:assert/strict';
import { runStaticAnalysis } from '../src/analyzers/ruleEngine';
import { InvestigationContext } from '../src/schema/investigation';

function makeContext(overrides: Partial<InvestigationContext> = {}): InvestigationContext {
  return {
    file: {
      path: 'src/app.ts',
      languageId: 'typescript',
      selection: null,
      fullContentSnippet: 'import { foo } from "bar";\n',
    },
    stackTrace: "Error: Cannot find module 'bar'",
    terminalOutput: null,
    manifests: [
      {
        kind: 'package.json',
        path: 'package.json',
        contentSnippet: '{"name":"demo"}',
      },
    ],
    environment: {
      nodeVersion: 'v20.11.0',
      pythonVersion: null,
      packageManager: 'npm',
      operatingSystem: 'win32 10',
    },
    workspace: {
      rootPath: 'C:/workspace',
      frameworks: [],
      primaryLanguage: 'typescript',
    },
    collectedAt: new Date().toISOString(),
    ...overrides,
  };
}

test('runStaticAnalysis returns a deterministic report for a missing npm dependency', () => {
  const result = runStaticAnalysis(makeContext());

  assert.ok(result);
  assert.equal(result?.ruleId, 'missing-npm-dependency');
  assert.equal(result?.source, 'static-analysis');
  assert.ok(result?.confidence >= 90);
  assert.ok(result?.fixSteps.length > 0);
});
