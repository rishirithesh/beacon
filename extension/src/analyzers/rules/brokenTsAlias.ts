import { AnalyzerRule } from "../types";
import { InvestigationReport } from "../../schema/investigation";

/** Cross-checks a TS "Cannot find module '@x/y'" against tsconfig `paths` entries. */
export const brokenTsAliasRule: AnalyzerRule = {
  id: "broken-ts-alias",
  description: "Detects path-alias imports that don't resolve against tsconfig.json paths",
  run(context): InvestigationReport | null {
    const source = context.stackTrace ?? context.terminalOutput ?? "";
    const match = /Cannot find module '(@[^']+|~\/[^']+)'/.exec(source);
    if (!match) return null;

    const aliasImport = match[1];
    const tsconfig = context.manifests.find((m) => m.kind === "tsconfig.json");
    if (!tsconfig) return null;

    const hasPathsBlock = /"paths"\s*:/.test(tsconfig.contentSnippet);
    const aliasPrefix = aliasImport.split("/")[0];
    const aliasDeclared = new RegExp(`"${aliasPrefix.replace("*", "\\*")}[^"]*"\\s*:`).test(
      tsconfig.contentSnippet,
    );

    if (aliasDeclared) return null; // declared correctly, likely a different problem - defer to AI

    return {
      source: "static-analysis",
      ruleId: brokenTsAliasRule.id,
      rootCause: hasPathsBlock
        ? `The alias "${aliasPrefix}" is used but has no matching entry in tsconfig.json's "paths".`
        : `tsconfig.json has no "paths" block, but the code imports using the alias "${aliasPrefix}".`,
      evidence: [
        { label: `Import uses unresolved alias "${aliasImport}"`, satisfied: true },
        { label: `No matching "paths" entry for "${aliasPrefix}" in tsconfig.json`, satisfied: true },
      ],
      confidence: 85,
      fixSteps: [
        `Add "${aliasPrefix}/*" to compilerOptions.paths in tsconfig.json`,
        "Ensure your bundler (webpack/vite/esbuild) mirrors the same alias",
      ],
      commands: [],
      affectedFiles: [tsconfig.path, context.file.path],
      estimatedFixTime: "3-5 minutes",
      potentialSideEffects: ["May require restarting the TS server / dev server to pick up the change"],
    };
  },
};
