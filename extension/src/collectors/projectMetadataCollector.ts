import * as vscode from "vscode";
import { DependencyManifest } from "../schema/investigation";
import { safeReadFile } from "../utils/fileSystem";
import { redactSecrets, truncate } from "../utils/redact";

const MANIFEST_GLOBS: Array<{ kind: DependencyManifest["kind"]; glob: string }> = [
  { kind: "package.json", glob: "**/package.json" },
  { kind: "requirements.txt", glob: "**/requirements.txt" },
  { kind: "Cargo.toml", glob: "**/Cargo.toml" },
  { kind: "pubspec.yaml", glob: "**/pubspec.yaml" },
  { kind: "pom.xml", glob: "**/pom.xml" },
  { kind: "tsconfig.json", glob: "**/tsconfig.json" },
  { kind: "vite.config", glob: "**/vite.config.{ts,js}" },
  { kind: "next.config", glob: "**/next.config.{ts,js,mjs}" },
];

const EXCLUDE = "**/{node_modules,.git,dist,build,.next,.venv}/**";

/**
 * Only collects manifests that actually exist in the workspace. Missing
 * project files (e.g. no Cargo.toml in a Node project) are simply absent -
 * that absence is itself useful evidence for the static analyzers.
 */
export async function collectProjectManifests(): Promise<DependencyManifest[]> {
  const manifests: DependencyManifest[] = [];

  for (const { kind, glob } of MANIFEST_GLOBS) {
    const [uri] = await vscode.workspace.findFiles(glob, EXCLUDE, 1);
    if (!uri) continue;
    const content = await safeReadFile(uri, 6000);
    if (content === null) continue;
    manifests.push({
      kind,
      path: vscode.workspace.asRelativePath(uri),
      contentSnippet: truncate(redactSecrets(content), 4000),
    });
  }

  return manifests;
}
