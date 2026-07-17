import { AnalyzerRule } from "../types";
import { InvestigationReport } from "../../schema/investigation";

export const missingFileRule: AnalyzerRule = {
  id: "missing-file",
  description: "Detects ENOENT-style failures referencing a specific path",
  run(context): InvestigationReport | null {
    const source = context.stackTrace ?? context.terminalOutput ?? "";
    const match =
      /ENOENT.*?(?:no such file or directory,? (?:open|stat)? ?'?([^'\n]+)'?)/is.exec(source) ??
      /FileNotFoundError:.*?'([^']+)'/.exec(source);
    if (!match) return null;

    const missingPath = match[1].trim();

    return {
      source: "static-analysis",
      ruleId: missingFileRule.id,
      rootCause: `The process tried to access "${missingPath}", which does not exist at that path.`,
      evidence: [{ label: `File-not-found error references "${missingPath}"`, satisfied: true }],
      confidence: 88,
      fixSteps: [
        `Verify "${missingPath}" exists and the path is spelled/cased correctly`,
        "Check whether it's a build output that needs to be generated first",
      ],
      commands: [],
      affectedFiles: [missingPath],
      estimatedFixTime: "2-5 minutes",
      potentialSideEffects: [],
    };
  },
};
