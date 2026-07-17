export interface EvidenceItem {
  label: string;
  satisfied: boolean;
}

export interface InvestigationReport {
  source: "static-analysis" | "ai";
  ruleId: string | null;
  rootCause: string;
  evidence: EvidenceItem[];
  confidence: number;
  fixSteps: string[];
  commands: string[];
  affectedFiles: string[];
  estimatedFixTime: string;
  potentialSideEffects: string[];
}

export type HostMessage =
  | { type: "loading" }
  | { type: "report"; payload: InvestigationReport }
  | { type: "error"; payload: string };
