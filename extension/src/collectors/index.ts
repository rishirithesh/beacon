import * as vscode from "vscode";
import { InvestigationContext, InvestigationContextSchema } from "../schema/investigation";
import { collectFileContext } from "./fileCollector";
import { collectEnvironmentContext } from "./environmentCollector";
import { collectProjectManifests } from "./projectMetadataCollector";
import { collectTerminalOutput, terminalOutputBuffer } from "./terminalCollector";
import { collectWorkspaceMetadata } from "./workspaceCollector";
import { extractStackTrace } from "./stackTraceExtractor";

export { terminalOutputBuffer };

/**
 * Single entry point for the "Context First" principle: gathers everything
 * Beacon can, in parallel, with zero prompts to the developer.
 */
export async function collectInvestigationContext(): Promise<InvestigationContext> {
  const editor = vscode.window.activeTextEditor;

  const [manifests, environment] = await Promise.all([
    collectProjectManifests(),
    collectEnvironmentContext(),
  ]);

  const file = collectFileContext(editor);
  const workspace = collectWorkspaceMetadata(manifests, file.languageId ?? null);
  const terminalOutput = collectTerminalOutput();

  const context = {
    file,
    stackTrace: extractStackTrace(terminalOutput),
    terminalOutput,
    manifests,
    environment,
    workspace,
    collectedAt: new Date().toISOString(),
  };

  return InvestigationContextSchema.parse(context);
}
