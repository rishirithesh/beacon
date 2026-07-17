import { InvestigationContext, InvestigationReport } from "../schema/investigation";
import { AnalyzerRule } from "./types";
import { logger } from "../utils/logger";

import { missingNpmDependencyRule } from "./rules/missingNpmDependency";
import { missingPythonPackageRule } from "./rules/missingPythonPackage";
import { brokenTsAliasRule } from "./rules/brokenTsAlias";
import { portOccupiedRule } from "./rules/portOccupied";
import { missingFileRule } from "./rules/missingFile";
import { permissionDeniedRule } from "./rules/permissionDenied";
import { incorrectNodeVersionRule } from "./rules/incorrectNodeVersion";
import { incorrectPythonInterpreterRule } from "./rules/incorrectPythonInterpreter";
import { missingEnvVariableRule } from "./rules/missingEnvVariable";
import { configMismatchRule } from "./rules/configMismatch";

/**
 * Ordered by specificity: rules that match on a very precise error signature
 * (port occupied, missing module) run before broader heuristics. First rule
 * to return a non-null report wins - "Known Rule Matching" step of the
 * pipeline, strictly before any AI call.
 */
const RULES: AnalyzerRule[] = [
  portOccupiedRule,
  missingNpmDependencyRule,
  missingPythonPackageRule,
  brokenTsAliasRule,
  missingFileRule,
  permissionDeniedRule,
  incorrectNodeVersionRule,
  incorrectPythonInterpreterRule,
  missingEnvVariableRule,
  configMismatchRule,
];

export function runStaticAnalysis(context: InvestigationContext): InvestigationReport | null {
  for (const rule of RULES) {
    const result = rule.run(context);
    if (result) {
      logger.info(`Static rule matched: ${rule.id}`);
      return result;
    }
  }
  logger.info("No static rule matched - falling through to AI investigation");
  return null;
}
