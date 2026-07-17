import React, { useState } from "react";
import { getVsCodeApi } from "../vscodeApi";

/**
 * "Copy Buttons" from the spec's report list. Uses the VS Code clipboard
 * command via postMessage so it works identically to a first-party panel
 * (navigator.clipboard is unreliable inside a webview sandbox).
 */
export function CopyButton({ text }: { text: string }): React.ReactElement {
  const [copied, setCopied] = useState(false);

  const onCopy = (): void => {
    getVsCodeApi().postMessage({ type: "copy", payload: text });
    void navigator.clipboard?.writeText(text).catch(() => undefined);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <button
      onClick={onCopy}
      className="rounded border border-border px-2 py-1 text-[11px] text-muted transition-colors hover:border-accent hover:text-[var(--vscode-editor-foreground)]"
      aria-label="Copy to clipboard"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
