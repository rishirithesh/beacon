import * as vscode from "vscode";
import { logger } from "./utils/logger";
import { registerInvestigateErrorCommand } from "./commands/investigateError";
import { InvestigationService } from "./services/investigationService";
import { terminalOutputBuffer } from "./collectors";

export function activate(context: vscode.ExtensionContext): void {
  logger.init();
  logger.info("Beacon is activating");

  terminalOutputBuffer.activate();
  context.subscriptions.push({ dispose: () => terminalOutputBuffer.dispose() });

  const investigationService = new InvestigationService();
  registerInvestigateErrorCommand(context, investigationService);

  logger.info("Beacon is ready");
}

export function deactivate(): void {
  logger.dispose();
}
