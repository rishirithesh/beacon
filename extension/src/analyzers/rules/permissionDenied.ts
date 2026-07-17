import { AnalyzerRule } from "../types";
import { InvestigationReport } from "../../schema/investigation";

export const permissionDeniedRule: AnalyzerRule = {
  id: "permission-denied",
  description: "Detects EACCES / permission-denied failures",
  run(context): InvestigationReport | null {
    const source = context.stackTrace ?? context.terminalOutput ?? "";
    const match = /EACCES.*?'?([^\s',]+)'?|Permission denied:? '?([^\s',]+)'?/i.exec(source);
    if (!match) return null;

    const target = (match[1] ?? match[2] ?? "the target path").trim();
    const isWindows = context.environment.operatingSystem.toLowerCase().includes("win32");

    return {
      source: "static-analysis",
      ruleId: permissionDeniedRule.id,
      rootCause: `The current user lacks permission to access "${target}".`,
      evidence: [{ label: `Permission error reported for "${target}"`, satisfied: true }],
      confidence: 87,
      fixSteps: isWindows
        ? [`Run your editor/terminal as Administrator, or adjust the ACL on "${target}"`]
        : [`Fix ownership or permissions on "${target}"`],
      commands: isWindows ? [] : [`chmod +r "${target}"`, `sudo chown $(whoami) "${target}"`],
      affectedFiles: [target],
      estimatedFixTime: "2-3 minutes",
      potentialSideEffects: ["Changing ownership/permissions affects any other process relying on the current permissions"],
    };
  },
};
