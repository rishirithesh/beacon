import { AiInvestigationResult, AiInvestigationResultSchema } from "../schema/investigation";
import { buildInvestigationPrompt } from "./promptBuilder";
import { InvestigationContext } from "../schema/investigation";
import { logger } from "../utils/logger";

const GEMINI_ENDPOINT = (model: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

export class GeminiInvestigationError extends Error {}

/**
 * The ONLY module in the codebase allowed to call an LLM. Every other layer
 * depends on this through the InvestigationService, never directly, so
 * swapping providers later (e.g. adding a Claude or local-model provider)
 * never touches collectors/analyzers.
 */
export async function investigateWithGemini(
  context: InvestigationContext,
  apiKey: string,
  model: string,
): Promise<AiInvestigationResult> {
  if (!apiKey) {
    throw new GeminiInvestigationError(
      "No Gemini API key configured. Set beacon.gemini.apiKey to enable AI investigation.",
    );
  }

  const { system, user } = buildInvestigationPrompt(context);

  const response = await fetch(`${GEMINI_ENDPOINT(model)}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts: [{ text: user }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    }),
  });

  if (!response.ok) {
    const bodyText = await response.text().catch(() => "");
    throw new GeminiInvestigationError(`Gemini request failed (${response.status}): ${bodyText}`);
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    throw new GeminiInvestigationError("Gemini returned no content to parse.");
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(rawText);
  } catch {
    logger.error("Gemini response was not valid JSON", { rawText });
    throw new GeminiInvestigationError("Gemini response was not valid JSON.");
  }

  const validation = AiInvestigationResultSchema.safeParse(parsedJson);
  if (!validation.success) {
    logger.error("Gemini response failed schema validation", validation.error.flatten());
    throw new GeminiInvestigationError("Gemini response did not match the required schema.");
  }

  return validation.data;
}
