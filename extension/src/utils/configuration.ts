export interface BeaconSettings {
  enableAi: boolean;
  enableStaticAnalysis: boolean;
  cacheEnabled: boolean;
  privacyMode: boolean;
  geminiModel: string;
  geminiApiKey: string;
}

function getWorkspaceConfiguration(): { get<T>(section: string, fallback: T): T } | undefined {
  try {
    const vscode = require('vscode') as typeof import('vscode');
    return vscode.workspace.getConfiguration('beacon');
  } catch {
    return undefined;
  }
}

export function buildBeaconSettings(overrides: Partial<BeaconSettings> = {}): BeaconSettings {
  const config = getWorkspaceConfiguration();
  return {
    enableAi: config?.get<boolean>('enableAI', true) ?? true,
    enableStaticAnalysis: config?.get<boolean>('enableStaticAnalysis', true) ?? true,
    cacheEnabled: config?.get<boolean>('cache.enabled', true) ?? true,
    privacyMode: config?.get<boolean>('privacyMode', true) ?? true,
    geminiModel: config?.get<string>('gemini.model', 'gemini-2.0-flash') ?? 'gemini-2.0-flash',
    geminiApiKey: config?.get<string>('gemini.apiKey', '') ?? '',
    ...overrides,
  };
}

export function resolveApiKeyValue(storedKey: string | undefined, fallbackKey: string): string {
  return storedKey && storedKey.trim() !== '' ? storedKey : fallbackKey;
}
