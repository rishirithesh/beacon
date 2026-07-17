import { AnalyzerRule } from "../types";
import { InvestigationReport } from "../../schema/investigation";

function parseMajor(version: string | null): number | null {
  if (!version) return null;
  const match = /(\d+)\./.exec(version.replace("v", ""));
  return match ? parseInt(match[1], 10) : null;
}

export const incorrectNodeVersionRule: AnalyzerRule = {
  id: "incorrect-node-version",
  description: "Cross-checks the active Node version against package.json's engines.node field",
  run(context): InvestigationReport | null {
    const pkg = context.manifests.find((m) => m.kind === "package.json");
    if (!pkg) return null;

    const enginesMatch = /"engines"\s*:\s*{[^}]*"node"\s*:\s*"([^"]+)"/.exec(pkg.contentSnippet);
    if (!enginesMatch) return null;

    const requiredRange = enginesMatch[1];
    const requiredMinMatch = /(\d+)/.exec(requiredRange);
    const requiredMajor = requiredMinMatch ? parseInt(requiredMinMatch[1], 10) : null;
    const activeMajor = parseMajor(context.environment.nodeVersion);

    if (requiredMajor === null || activeMajor === null) return null;
    if (activeMajor >= requiredMajor) return null;

    return {
      source: "static-analysis",
      ruleId: incorrectNodeVersionRule.id,
      rootCause: `package.json requires Node "${requiredRange}" but the active Node version is ${context.environment.nodeVersion}.`,
      evidence: [
        { label: `Active Node version is ${context.environment.nodeVersion}`, satisfied: true },
        { label: `package.json requires engines.node "${requiredRange}"`, satisfied: true },
      ],
      confidence: 89,
      fixSteps: ["Switch to a Node version that satisfies the engines.node requirement"],
      commands: ["nvm install --lts", "nvm use --lts"],
      affectedFiles: [pkg.path],
      estimatedFixTime: "2-4 minutes",
      potentialSideEffects: ["Other projects using nvm's default version may be affected if you change the global default"],
    };
  },
};
