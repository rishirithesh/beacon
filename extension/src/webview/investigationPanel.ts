import * as vscode from "vscode";
import { InvestigationReport } from "../schema/investigation";

/**
 * Owns the single webview panel Beacon ever shows. No chat UI, no message
 * history - each "Investigate" click replaces the panel's content with a
 * fresh report, per the "Native Experience" / "no prompt boxes" principle.
 */
export class InvestigationPanel {
  private static current: InvestigationPanel | undefined;
  private readonly panel: vscode.WebviewPanel;

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this.panel = panel;
    this.panel.onDidDispose(() => (InvestigationPanel.current = undefined));
    this.panel.webview.html = this.renderShell(extensionUri);
  }

  static show(extensionUri: vscode.Uri): InvestigationPanel {
    if (InvestigationPanel.current) {
      InvestigationPanel.current.panel.reveal(vscode.ViewColumn.Beside);
      return InvestigationPanel.current;
    }

    const panel = vscode.window.createWebviewPanel(
      "beacon.investigation",
      "Beacon Investigation",
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, "dist", "webview")],
        retainContextWhenHidden: true,
      },
    );

    InvestigationPanel.current = new InvestigationPanel(panel, extensionUri);
    return InvestigationPanel.current;
  }

  setLoading(): void {
    this.panel.webview.postMessage({ type: "loading" });
  }

  setReport(report: InvestigationReport): void {
    this.panel.webview.postMessage({ type: "report", payload: report });
  }

  setError(message: string): void {
    this.panel.webview.postMessage({ type: "error", payload: message });
  }

  private renderShell(extensionUri: vscode.Uri): string {
    const scriptUri = this.panel.webview.asWebviewUri(
      vscode.Uri.joinPath(extensionUri, "dist", "webview", "main.js"),
    );
    const nonce = String(Date.now());

    // The webview build inlines its CSS into main.js (via injected <style> tags),
    // so the CSP allows 'unsafe-inline' style only - no separate stylesheet to link.
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy"
    content="default-src 'none'; style-src ${this.panel.webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';" />
  <title>Beacon Investigation</title>
</head>
<body>
  <div id="root"></div>
  <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
  }
}
