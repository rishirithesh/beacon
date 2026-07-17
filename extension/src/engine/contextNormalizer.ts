import { InvestigationContext } from '../schema/investigation';

export interface NormalizedContext extends InvestigationContext {}

function normalizePath(path: string): string {
  return path.replace(/\\/g, '/').replace(/^\\/g, '').trim();
}

function normalizeLanguage(language: string): string {
  return language.toLowerCase().replace(/\s+/g, '');
}

function normalizePackageManager(packageManager: string): InvestigationContext['environment']['packageManager'] {
  const normalized = packageManager.toLowerCase();
  if (['npm', 'yarn', 'pnpm', 'bun', 'pip', 'poetry'].includes(normalized)) {
    return normalized as InvestigationContext['environment']['packageManager'];
  }
  return 'unknown';
}

function normalizeOperatingSystem(operatingSystem: string): string {
  const normalized = operatingSystem.toLowerCase();
  if (normalized.includes('win')) return 'windows';
  if (normalized.includes('darwin') || normalized.includes('mac')) return 'macos';
  if (normalized.includes('linux') || normalized.includes('ubuntu')) return 'linux';
  return normalized;
}

export function normalizeContext(context: InvestigationContext): NormalizedContext {
  return {
    ...context,
    file: {
      ...context.file,
      path: normalizePath(context.file.path),
      languageId: normalizeLanguage(context.file.languageId),
      selection: context.file.selection?.trim() ?? null,
    },
    environment: {
      ...context.environment,
      packageManager: normalizePackageManager(context.environment.packageManager),
      operatingSystem: normalizeOperatingSystem(context.environment.operatingSystem),
    },
    workspace: {
      ...context.workspace,
      rootPath: context.workspace.rootPath ? normalizePath(context.workspace.rootPath) : null,
    },
  };
}
