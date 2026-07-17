import { AnalyzerRule } from "../types";
import { InvestigationReport } from "../../schema/investigation";

export const missingEnvVariableRule: AnalyzerRule = {
  id: "missing-environment-variable",
  description: "Detects errors that reference an undefined environment variable",
  run(context): InvestigationReport | null {
    const source = context.stackTrace ?? context.terminalOutput ?? "";
    const match =
      /process\.env\.(\w+) is (?:not defined|undefined)/.exec(source) ??
      /Missing required environment variable:? ["']?(\w+)/i.exec(source) ??
      /KeyError: ["'](\w+)["']/.exec(source);
    if (!match) return null;

    const varName = match[1];

    return {
      source: "static-analysis",
      ruleId: missingEnvVariableRule.id,
      rootCause: `The environment variable "${varName}" is required but not set in the current environment.`,
      evidence: [{ label: `Error indicates "${varName}" is missing`, satisfied: true }],
      confidence: 84,
      fixSteps: [
        `Set ${varName} in your local .env file or shell environment`,
        "Restart the dev server so the new value is picked up",
      ],
      commands: [`export ${varName}=your_value_here`],
      affectedFiles: [],
      estimatedFixTime: "1-2 minutes",
      potentialSideEffects: ["Beacon never reads or displays your .env contents - you'll need to set the value yourself"],
    };
  },
};
