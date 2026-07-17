import React from "react";
import { EvidenceItem } from "../types";

export function EvidenceList({ evidence }: { evidence: EvidenceItem[] }): React.ReactElement {
  return (
    <ul className="flex flex-col gap-1.5">
      {evidence.map((item) => (
        <li key={item.label} className="flex items-start gap-2 text-[13px]">
          <span className={item.satisfied ? "text-emerald-500" : "text-red-400"}>
            {item.satisfied ? "✓" : "✗"}
          </span>
          <span className={item.satisfied ? "" : "text-muted"}>{item.label}</span>
        </li>
      ))}
    </ul>
  );
}
