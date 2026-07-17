import { AnalyzerRule } from "../types";
import { InvestigationReport } from "../../schema/investigation";

/** Matches Node's classic "Cannot find module 'x'" against package.json's declared deps. */
export const missingNpmDependencyRule: AnalyzerRule = {
  id: "missing-npm-dependency",
  description: "Detects imports of packages that are not declared in package.json",
  run(context): InvestigationReport | null {
    const source = context.stackTrace ?? context.terminalOutput ?? "";
    const match = /Cannot find module '([^'.][^']*)'/.exec(source);
    if (!match) return null;

    const moduleName = match[1].split("/")[0];
    const pkgManifest = context.manifests.find((m) => m.kind === "package.json");
    if (!pkgManifest) return null;

    const isBuiltin = moduleName.startsWith("node:");
    if (isBuiltin) return null;

    const declared = new RegExp(`"${moduleName}"\\s*:`).test(pkgManifest.contentSnippet);
    if (declared) return null; // it's declared - likely a real install issue, not a missing dep. Let AI decide.

    return {
      source: "static-analysis",
      ruleId: missingNpmDependencyRule.id,
      rootCause: `The module "${moduleName}" is imported but not listed as a dependency in package.json.`,
      evidence: [
        { label: `Error references missing module "${moduleName}"`, satisfied: true },
        { label: `"${moduleName}" not found in package.json`, satisfied: true },
      ],
      confidence: 92,
      fixSteps: [
        `Install ${moduleName} and add it to package.json`,
        "Re-run the project to confirm the import resolves",
      ],
      commands: [`${context.environment.packageManager} install ${moduleName}`],
      affectedFiles: [pkgManifest.path, context.file.path],
      estimatedFixTime: "1-2 minutes",
      potentialSideEffects: ["Adds a new entry to package.json and the lockfile"],
    };
  },
};
