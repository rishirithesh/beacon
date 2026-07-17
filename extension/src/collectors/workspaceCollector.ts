import * as vscode from "vscode";
import { DependencyManifest, WorkspaceMetadata } from "../schema/investigation";

const FRAMEWORK_SIGNALS: Record<string, RegExp> = {
  React: /"react"\s*:/,
  "Next.js": /"next"\s*:/,
  Vue: /"vue"\s*:/,
  Angular: /"@angular\/core"\s*:/,
  Svelte: /"svelte"\s*:/,
  Express: /"express"\s*:/,
  Django: /Django==/,
  Flask: /Flask==/,
  FastAPI: /fastapi/i,
  "Spring Boot": /spring-boot-starter/,
  Flutter: /flutter:/,
};

/** Derives high-level workspace facts (framework, primary language) from already-collected manifests. */
export function collectWorkspaceMetadata(
  manifests: DependencyManifest[],
  activeLanguageId: string | null,
): WorkspaceMetadata {
  const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? null;

  const frameworks = Object.entries(FRAMEWORK_SIGNALS)
    .filter(([, pattern]) => manifests.some((m) => pattern.test(m.contentSnippet)))
    .map(([name]) => name);

  return {
    rootPath,
    frameworks,
    primaryLanguage: activeLanguageId,
  };
}
