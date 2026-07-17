import { InvestigationContext, InvestigationReport } from '../schema/investigation';

export interface InvestigationBuilderInput {
  context: InvestigationContext;
  framework: string;
  source: 'static-analysis' | 'ai' | 'insufficient-evidence';
  ruleId: string | null;
  rootCause: string;
  evidence: Array<{ label: string; satisfied: boolean }>;
  confidence: number;
  fixSteps: string[];
  commands: string[];
  affectedFiles: string[];
  estimatedFixTime: string;
  potentialSideEffects: string[];
}

export function buildInvestigationReport(input: InvestigationBuilderInput): InvestigationReport {
  const normalizedEvidence = input.evidence.length > 0
    ? input.evidence
    : [{ label: 'Beacon collected project context but could not identify a deterministic root cause.', satisfied: false }];

  const normalizedAffectedFiles = input.affectedFiles.length > 0
    ? input.affectedFiles
    : [input.context.file.path];

  return {
    source: input.source === 'static-analysis' ? 'static-analysis' : 'ai',
    ruleId: input.ruleId,
    rootCause: input.rootCause,
    evidence: normalizedEvidence,
    confidence: Math.min(100, Math.max(0, input.confidence)),
    fixSteps: input.fixSteps.length > 0 ? input.fixSteps : ['Inspect the current file and related project configuration manually.'],
    commands: input.commands,
    affectedFiles: normalizedAffectedFiles,
    estimatedFixTime: input.estimatedFixTime,
    potentialSideEffects: input.potentialSideEffects,
  };
}
