import React from "react";
import { CopyButton } from "./CopyButton";

export function CommandBlock({ commands }: { commands: string[] }): React.ReactElement | null {
  if (commands.length === 0) return null;
  return (
    <div className="flex flex-col gap-2">
      {commands.map((command) => (
        <div
          key={command}
          className="flex items-center justify-between gap-3 rounded-md border border-border bg-black/20 px-3 py-2"
        >
          <code className="overflow-x-auto whitespace-pre font-mono text-[12px]">{command}</code>
          <CopyButton text={command} />
        </div>
      ))}
    </div>
  );
}
