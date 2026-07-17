import { AnalyzerRule } from "../types";
import { InvestigationReport } from "../../schema/investigation";

export const portOccupiedRule: AnalyzerRule = {
  id: "port-already-occupied",
  description: "Detects EADDRINUSE / 'address already in use' failures",
  run(context): InvestigationReport | null {
    const source = context.stackTrace ?? context.terminalOutput ?? "";
    const match = /EADDRINUSE.*?:(\d{2,5})|address already in use.*?:(\d{2,5})/is.exec(source);
    if (!match) return null;

    const port = match[1] ?? match[2];
    const isWindows = context.environment.operatingSystem.toLowerCase().includes("win32");

    return {
      source: "static-analysis",
      ruleId: portOccupiedRule.id,
      rootCause: `Port ${port} is already bound by another process, so the server failed to start.`,
      evidence: [{ label: `EADDRINUSE reported for port ${port}`, satisfied: true }],
      confidence: 96,
      fixSteps: [
        `Find the process holding port ${port} and stop it, or run this project on a different port`,
      ],
      commands: isWindows
        ? [`netstat -ano | findstr :${port}`]
        : [`lsof -i :${port}`, `kill -9 $(lsof -t -i:${port})`],
      affectedFiles: [],
      estimatedFixTime: "under 1 minute",
      potentialSideEffects: ["Killing the process will stop whatever else is currently using that port"],
    };
  },
};
