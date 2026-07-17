import React from "react";

export function ConfidenceMeter({ confidence }: { confidence: number }): React.ReactElement {
  const tone = confidence >= 80 ? "bg-emerald-500" : confidence >= 50 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="flex items-center gap-2">
      <div className="h-1 w-24 overflow-hidden rounded-full bg-border">
        <div className={`h-full ${tone}`} style={{ width: `${confidence}%` }} />
      </div>
      <span className="font-mono text-xs text-muted">{confidence}%</span>
    </div>
  );
}
