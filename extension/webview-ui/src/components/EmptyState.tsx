import React from "react";

export function EmptyState(): React.ReactElement {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2 px-6 text-center">
      <div className="text-2xl">🔦</div>
      <p className="text-sm text-muted">
        Run <span className="font-mono text-[var(--vscode-editor-foreground)]">Beacon: Investigate Error</span> to
        start an investigation.
      </p>
    </div>
  );
}
