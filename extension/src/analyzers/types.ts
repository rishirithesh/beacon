import { InvestigationContext, InvestigationReport } from "../schema/investigation";

/**
 * Every static rule is a pure function: context in, report or "not applicable"
 * out. This is what makes it safe to run all of them on every investigation
 * without side effects or ordering dependencies.
 */
export interface AnalyzerRule {
  id: string;
  description: string;
  run(context: InvestigationContext): InvestigationReport | null;
}
