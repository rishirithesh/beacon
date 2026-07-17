import { AnalyzerRule } from "../types";
import { InvestigationReport } from "../../schema/investigation";

/** Detects when the file being edited uses ESM syntax but package.json isn't configured for it (or vice versa). */
export const configMismatchRule: AnalyzerRule = {
  id: "configuration-mismatch",
  description: "Detects ESM/CommonJS module-system mismatches between source and package.json",
  run(context): InvestigationReport | null {
    const source = context.stackTrace ?? context.terminalOutput ?? "";
    const isEsmError =
      /Cannot use import statement outside a module/.test(source) ||
      /require\(\) of ES Module/.test(source);
    if (!isEsmError) return null;

    const pkg = context.manifests.find((m) => m.kind === "package.json");
    const declaredType = pkg ? /"type"\s*:\s*"(\w+)"/.exec(pkg.contentSnippet)?.[1] : null;

    const usesImportSyntax = /Cannot use import statement outside a module/.test(source);

    return {
      source: "static-analysis",
      ruleId: configMismatchRule.id,
      rootCause: usesImportSyntax
        ? `The file uses ESM "import" syntax but package.json ${
            declaredType
              ? `declares "type": "${declaredType}"`
              : 'has no "type" field (defaults to CommonJS)'
          }.`
        : "A CommonJS require() is being used to load a package that ships only ES Modules.",
      evidence: [
        { label: "Runtime error matches an ESM/CommonJS mismatch", satisfied: true },
        {
          label: pkg
            ? `package.json "type" field is ${declaredType ?? "unset (CommonJS default)"}`
            : "No package.json found to confirm module type",
          satisfied: true,
        },
      ],
      confidence: 81,
      fixSteps: usesImportSyntax
        ? ['Add "type": "module" to package.json, or rename the file to use a .mjs extension']
        : ["Use dynamic import() instead of require() for this package, or downgrade to a CJS-compatible version"],
      commands: [],
      affectedFiles: pkg ? [pkg.path, context.file.path] : [context.file.path],
      estimatedFixTime: "2-4 minutes",
      potentialSideEffects: [
        'Setting "type": "module" affects how every .js file in the project is interpreted',
      ],
    };
  },
};
