import test from 'node:test';
import assert from 'node:assert/strict';
import { buildBeaconSettings, resolveApiKeyValue } from '../src/utils/configuration';

test('buildBeaconSettings normalizes booleans and fallback values', () => {
  const settings = buildBeaconSettings({
    enableAi: true,
    enableStaticAnalysis: false,
    cacheEnabled: true,
    privacyMode: true,
    geminiModel: 'gemini-2.0-flash',
    geminiApiKey: '',
  });

  assert.equal(settings.enableAi, true);
  assert.equal(settings.enableStaticAnalysis, false);
  assert.equal(settings.privacyMode, true);
  assert.equal(settings.geminiModel, 'gemini-2.0-flash');
});

test('resolveApiKeyValue prefers a stored secret over config fallback', () => {
  assert.equal(resolveApiKeyValue('stored-key', 'fallback-key'), 'stored-key');
  assert.equal(resolveApiKeyValue(undefined, 'fallback-key'), 'fallback-key');
});
