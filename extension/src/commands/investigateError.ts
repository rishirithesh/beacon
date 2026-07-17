import * as vscode from "vscode";
import { InvestigationService } from "../services/investigationService";
import { InvestigationPanel } from "../webview/investigationPanel";
import { logger } from "../utils/logger";

/**
 * The MVP's single feature. No parameters, no dialogs asking the developer
 * to describe the problem - context collection does that work silently.
 */
export function registerInvestigateErrorCommand(
  context: vscode.ExtensionContext,
  service: InvestigationService,
): void {
  const disposable = vscode.commands.registerCommand("beacon.investigateError", async () => {
    const panel = InvestigationPanel.show(context.extensionUri);
    panel.setLoading();

    try {
      const { report } = await service.investigate();
      panel.setReport(report);
      logger.info("Investigation complete", { source: report.source, confidence: report.confidence });
      void vscode.window.setStatusBarMessage(`Beacon: investigation complete (${report.confidence}% confidence)`, 2500);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error during investigation.";
      logger.error("Investigation failed", { message });
      panel.setError(message);
      void vscode.window.showErrorMessage(`Beacon: ${message}`);
      void vscode.window.setStatusBarMessage("Beacon: investigation failed", 2500);
    }
  });

  context.subscriptions.push(disposable);
}
