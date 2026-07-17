/**
 * Privacy layer: nothing in the Context Collectors, Analyzers, or AI Layer
 * should hand raw file/env content to a network call without passing
 * through here first.
 */

const DENYLIST_PATH_SEGMENTS = ["node_modules", ".git", "dist", "build", ".next", ".venv"];

const SECRET_KEY_PATTERN =
  /\b([A-Z0-9_]*(?:SECRET|TOKEN|API_?KEY|PASSWORD|PRIVATE_?KEY)[A-Z0-9_]*)\s*[:=]\s*['"]?([^\s'"]+)/gi;

export function isPathExcluded(filePath: string): boolean {
  const normalized = filePath.replace(/\\/g, "/");
  return DENYLIST_PATH_SEGMENTS.some((segment) => normalized.includes(`/${segment}/`));
}

export function isEnvFile(filePath: string): boolean {
  const base = filePath.split(/[\\/]/).pop() ?? "";
  return base === ".env" || base.startsWith(".env.");
}

/** Redacts anything that looks like a secret before it ever leaves the machine. */
export function redactSecrets(content: string): string {
  return content.replace(SECRET_KEY_PATTERN, (_match, key: string) => `${key}=[REDACTED]`);
}

export function truncate(content: string, maxChars: number): string {
  if (content.length <= maxChars) return content;
  return `${content.slice(0, maxChars)}\n... [truncated ${content.length - maxChars} chars]`;
}
