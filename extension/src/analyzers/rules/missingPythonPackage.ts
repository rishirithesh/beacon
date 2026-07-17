import { AnalyzerRule } from "../types";
import { InvestigationReport } from "../../schema/investigation";

export const missingPythonPackageRule: AnalyzerRule = {
  id: "missing-python-package",
  description: "Detects ModuleNotFoundError against requirements.txt",
  run(context): InvestigationReport | null {
    const source = context.stackTrace ?? context.terminalOutput ?? "";
    const match = /ModuleNotFoundError: No module named '([^']+)'/.exec(source);
    if (!match) return null;

    const moduleName = match[1].split(".")[0];
    const reqManifest = context.manifests.find((m) => m.kind === "requirements.txt");
    const declared = reqManifest
      ? new RegExp(moduleName, "i").test(reqManifest.contentSnippet)
      : false;
    if (declared) return null;

    const installCommand =
      context.environment.packageManager === "poetry"
        ? `poetry add ${moduleName}`
        : `pip install ${moduleName}`;

    return {
      source: "static-analysis",
      ruleId: missingPythonPackageRule.id,
      rootCause: `Python cannot find the "${moduleName}" module because it isn't installed in the active interpreter.`,
      evidence: [
        { label: `ModuleNotFoundError raised for "${moduleName}"`, satisfied: true },
        {
          label: reqManifest
            ? `"${moduleName}" missing from requirements.txt`
            : "No requirements.txt found in workspace",
          satisfied: true,
        },
      ],
      confidence: 90,
      fixSteps: [
        `Install ${moduleName} in the active virtual environment`,
        reqManifest ? `Add ${moduleName} to requirements.txt` : "Create a requirements.txt to track it",
      ],
      commands: [installCommand],
      affectedFiles: reqManifest ? [reqManifest.path, context.file.path] : [context.file.path],
      estimatedFixTime: "1-2 minutes",
      potentialSideEffects: ["Installs a new package into the current environment"],
    };
  },
};
