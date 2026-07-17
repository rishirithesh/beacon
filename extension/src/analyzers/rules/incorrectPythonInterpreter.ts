import { AnalyzerRule } from "../types";
import { InvestigationReport } from "../../schema/investigation";

export const incorrectPythonInterpreterRule: AnalyzerRule = {
  id: "incorrect-python-interpreter",
  description: "Detects syntax errors typical of running Python 2-only or Python 3-only code on the wrong interpreter",
  run(context): InvestigationReport | null {
    if (context.file.languageId !== "python") return null;
    const source = context.stackTrace ?? context.terminalOutput ?? "";

    const py2PrintSyntax = /SyntaxError: Missing parentheses in call to 'print'/.test(source);
    const py3OnlySyntax = /f["']/.test(context.file.selection ?? "") && /SyntaxError/.test(source);

    if (!py2PrintSyntax && !py3OnlySyntax) return null;

    return {
      source: "static-analysis",
      ruleId: incorrectPythonInterpreterRule.id,
      rootCause: py2PrintSyntax
        ? `The active Python interpreter (${context.environment.pythonVersion ?? "unknown version"}) is Python 2, but the code uses Python 3 print syntax.`
        : `The code uses a Python 3-only feature (f-strings) but appears to be running on an older interpreter.`,
      evidence: [
        { label: "SyntaxError shape matches a Python 2/3 mismatch", satisfied: true },
        { label: `Active interpreter reports ${context.environment.pythonVersion ?? "unknown"}`, satisfied: true },
      ],
      confidence: 78,
      fixSteps: ["Select the correct Python interpreter for this project (Python 3.x)"],
      commands: ["python3 --version"],
      affectedFiles: [context.file.path],
      estimatedFixTime: "1-2 minutes",
      potentialSideEffects: [],
    };
  },
};
