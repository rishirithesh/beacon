import { InvestigationContext } from "../schema/investigation";

const SYSTEM_INSTRUCTIONS = `You are Beacon, a senior software engineer investigating why a developer's code broke.
You are the LAST STEP after static analysis has already failed to find a known pattern - do not restate
that fact, just do the investigation.

Return STRICT JSON matching exactly this shape, nothing else - no markdown, no code fences, no prose outside the JSON:
{
  "rootCause": string,
  "evidence": [{ "label": string, "satisfied": boolean }],
  "confidence": number (0-100),
  "fixSteps": string[],
  "commands": string[],
  "affectedFiles": string[],
  "estimatedFixTime": string,
  "potentialSideEffects": string[]
}

Rules:
- Every claim in "rootCause" must be backed by at least one item in "evidence".
- Never say "I think" or hedge in prose - "confidence" is where uncertainty belongs.
- "commands" must be copy-pasteable shell commands, or an empty array if none apply.
- Base your investigation only on the JSON context provided. Do not invent file contents you weren't given.`;

/**
 * Builds the structured JSON payload sent to Gemini. Only fields actually
 * populated by the collectors are included - never pads with empty noise,
 * per the "never send unnecessary files" rule.
 */
export function buildInvestigationPrompt(context: InvestigationContext): {
  system: string;
  user: string;
} {
  const payload = {
    activeFile: {
      path: context.file.path,
      language: context.file.languageId,
      selection: context.file.selection,
      snippet: context.file.fullContentSnippet,
    },
    stackTrace: context.stackTrace,
    terminalOutput: context.terminalOutput,
    relevantManifests: context.manifests.map((m) => ({
      kind: m.kind,
      path: m.path,
      snippet: m.contentSnippet,
    })),
    environment: context.environment,
    workspace: context.workspace,
  };

  return {
    system: SYSTEM_INSTRUCTIONS,
    user: JSON.stringify(payload, null, 2),
  };
}
