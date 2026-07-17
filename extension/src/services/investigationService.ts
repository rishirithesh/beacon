import * as vscode from "vscode";
import { InvestigationContext, InvestigationReport, InvestigationReportSchema } from "../schema/investigation";
import { collectInvestigationContext } from "../collectors";
import { runStaticAnalysis } from "../analyzers";
import { investigateWithGemini, GeminiInvestigationError } from "../ai/geminiProvider";
import { AnalysisCache } from "../utils/cache";
import { logger } from "../utils/logger";
import { normalizeContext } from "../engine/contextNormalizer";
import { validateContextOrThrow } from "../engine/contextValidator";
import { detectFramework } from "../engine/frameworkDetector";
import { buildInvestigationReport } from "../engine/investigationBuilder";
import { buildBeaconSettings, resolveApiKeyValue } from "../utils/configuration";
const cache = new AnalysisCache<InvestigationReport>();

/**
 * The one place that implements "AI is the Last Step":
 * Context Collection -> Static Analysis -> Known Rule Matching -> (only then) AI.
 * Commands never talk to collectors/analyzers/AI directly - only through here.
 */
export class InvestigationService {
  async investigate(): Promise<{ context: InvestigationContext; report: InvestigationReport }> {
    const rawContext = await collectInvestigationContext();
    const normalizedContext = normalizeContext(rawContext);
    const validatedContext = validateContextOrThrow(normalizedContext);
    const framework = detectFramework(validatedContext);

    const context = {
      ...validatedContext,
      workspace: {
        ...validatedContext.workspace,
        frameworks: [framework.framework],
      },
    };

    const settings = buildBeaconSettings();
    const cacheKey = context.file.path;
    const cacheContent = context.file.fullContentSnippet ?? "";
    const cachingEnabled = settings.cacheEnabled;

    if (cachingEnabled) {
      const cached = cache.get(cacheKey, cacheContent);
      if (cached) {
        logger.info("Serving cached investigation result", { file: cacheKey });
        return { context, report: cached };
      }
    }

    if (settings.enableStaticAnalysis) {
      const staticReport = runStaticAnalysis(context);
      if (staticReport) {
        const validatedReport = InvestigationReportSchema.parse(staticReport);
        if (cachingEnabled) cache.set(cacheKey, cacheContent, validatedReport);
        return { context, report: validatedReport };
      }
    }

    if (!settings.enableAi) {
      const fallbackReport = buildInvestigationReport({
        context,
        framework: context.workspace.frameworks[0] ?? "unknown",
        source: "insufficient-evidence",
        ruleId: null,
        rootCause: "Static analysis did not find a deterministic issue, and AI investigation is disabled in Beacon settings.",
        evidence: [{ label: "AI investigation is disabled", satisfied: true }],
        confidence: 15,
        fixSteps: ["Enable AI assistance in Beacon settings to get an AI-assisted fallback report."],
        commands: [],
        affectedFiles: [],
        estimatedFixTime: "unknown",
        potentialSideEffects: [],
      });
      if (cachingEnabled) cache.set(cacheKey, cacheContent, fallbackReport);
      return { context, report: fallbackReport };
    }

    const report = await this.runAiFallback(context, settings);
    if (cachingEnabled) cache.set(cacheKey, cacheContent, report);
    return { context, report };
  }

  private async runAiFallback(context: InvestigationContext, settings: ReturnType<typeof buildBeaconSettings>): Promise<InvestigationReport> {
    const apiKey = resolveApiKeyValue(undefined, settings.geminiApiKey);
    const model = settings.geminiModel;

    try {
      const aiResult = await investigateWithGemini(context, apiKey, model);
      return buildInvestigationReport({
        context,
        framework: context.workspace.frameworks[0] ?? "unknown",
        source: "ai",
        ruleId: null,
        rootCause: aiResult.rootCause,
        evidence: aiResult.evidence,
        confidence: aiResult.confidence,
        fixSteps: aiResult.fixSteps,
        commands: aiResult.commands,
        affectedFiles: aiResult.affectedFiles,
        estimatedFixTime: aiResult.estimatedFixTime,
        potentialSideEffects: aiResult.potentialSideEffects,
      });
    } catch (error) {
      const message =
        error instanceof GeminiInvestigationError
          ? error.message
          : "AI investigation failed unexpectedly.";
      logger.error("AI fallback failed", { message });

      // Beacon never leaves the developer with nothing - degrade to a
      // low-confidence, evidence-honest report rather than a hard failure.
      return buildInvestigationReport({
        context,
        framework: context.workspace.frameworks[0] ?? "unknown",
        source: "insufficient-evidence",
        ruleId: null,
        rootCause:
          "Beacon could not determine a root cause. Static analysis found no known pattern, and AI investigation was unavailable.",
        evidence: [
          { label: "No static rule matched the collected evidence", satisfied: true },
          { label: "AI investigation could not be completed", satisfied: false },
        ],
        confidence: 0,
        fixSteps: [
          message.includes("API key")
            ? "Set beacon.gemini.apiKey in Settings to enable AI-assisted investigation"
            : "Check the Beacon output channel for details, then try again",
        ],
        commands: [],
        affectedFiles: [],
        estimatedFixTime: "unknown",
        potentialSideEffects: [],
      });
    }
  }
}
