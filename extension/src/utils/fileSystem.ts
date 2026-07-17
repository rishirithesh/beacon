import * as vscode from "vscode";
import { isPathExcluded, isEnvFile } from "./redact";

/**
 * Every read that touches the workspace filesystem goes through here so the
 * privacy rules (never node_modules/.git/dist/build, never .env contents)
 * are enforced in exactly one place instead of scattered across collectors.
 */
export async function safeReadFile(uri: vscode.Uri, maxBytes = 20_000): Promise<string | null> {
  if (isPathExcluded(uri.fsPath) || isEnvFile(uri.fsPath)) {
    return null;
  }
  try {
    const bytes = await vscode.workspace.fs.readFile(uri);
    const text = Buffer.from(bytes).toString("utf8");
    return text.length > maxBytes ? text.slice(0, maxBytes) : text;
  } catch {
    return null;
  }
}

export async function findFirstMatch(pattern: string): Promise<vscode.Uri | null> {
  const exclude = "**/{node_modules,.git,dist,build,.next,.venv}/**";
  const [match] = await vscode.workspace.findFiles(pattern, exclude, 1);
  return match ?? null;
}
