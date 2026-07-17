import React from "react";

const STEPS = ["Collecting context", "Running static analysis", "Investigating"];

export function LoadingState(): React.ReactElement {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 px-6">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-accent" />
      <div className="flex flex-col items-center gap-1">
        {STEPS.map((step) => (
          <p key={step} className="text-xs text-muted">
            {step}
          </p>
        ))}
      </div>
    </div>
  );
}
