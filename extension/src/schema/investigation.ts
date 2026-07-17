import { z } from "zod";

/**
 * Every shape that crosses a layer boundary (collector -> analyzer -> AI -> webview)
 * is defined here and only here. No layer invents its own ad-hoc object shape.
 */

// ---------------------------------------------------------------------------
// Context (what collectors produce)
// ---------------------------------------------------------------------------

export const FileContextSchema = z.object({
  path: z.string(),
  languageId: z.string(),
  selection: z.string().nullable(),
  fullContentSnippet: z.string().nullable(), // truncated, never the whole file
});

export const DependencyManifestSchema = z.object({
  kind: z.enum([
    "package.json",
    "requirements.txt",
    "Cargo.toml",
    "pubspec.yaml",
    "pom.xml",
    "tsconfig.json",
    "vite.config",
    "next.config",
  ]),
  path: z.string(),
  contentSnippet: z.string(),
});

export const EnvironmentContextSchema = z.object({
  nodeVersion: z.string().nullable(),
  pythonVersion: z.string().nullable(),
  packageManager: z.enum(["npm", "yarn", "pnpm", "bun", "pip", "poetry", "unknown"]),
  operatingSystem: z.string(),
});

export const WorkspaceMetadataSchema = z.object({
  rootPath: z.string().nullable(),
  frameworks: z.array(z.string()),
  primaryLanguage: z.string().nullable(),
});

export const InvestigationContextSchema = z.object({
  file: FileContextSchema,
  stackTrace: z.string().nullable(),
  terminalOutput: z.string().nullable(),
  manifests: z.array(DependencyManifestSchema),
  environment: EnvironmentContextSchema,
  workspace: WorkspaceMetadataSchema,
  collectedAt: z.string(), // ISO timestamp
});

export type FileContext = z.infer<typeof FileContextSchema>;
export type DependencyManifest = z.infer<typeof DependencyManifestSchema>;
export type EnvironmentContext = z.infer<typeof EnvironmentContextSchema>;
export type WorkspaceMetadata = z.infer<typeof WorkspaceMetadataSchema>;
export type InvestigationContext = z.infer<typeof InvestigationContextSchema>;

// ---------------------------------------------------------------------------
// Result (what analyzers AND the AI layer both produce, in the same shape)
// ---------------------------------------------------------------------------

export const EvidenceItemSchema = z.object({
  label: z.string(),
  satisfied: z.boolean(),
});

export const InvestigationReportSchema = z.object({
  source: z.enum(["static-analysis", "ai"]),
  ruleId: z.string().nullable(), // set when source === "static-analysis"
  rootCause: z.string(),
  evidence: z.array(EvidenceItemSchema),
  confidence: z.number().min(0).max(100),
  fixSteps: z.array(z.string()),
  commands: z.array(z.string()),
  affectedFiles: z.array(z.string()),
  estimatedFixTime: z.string(),
  potentialSideEffects: z.array(z.string()),
});

export type EvidenceItem = z.infer<typeof EvidenceItemSchema>;
export type InvestigationReport = z.infer<typeof InvestigationReportSchema>;

// Strict schema the AI provider's raw JSON output is validated against.
// Intentionally narrower than InvestigationReport - "source" and "ruleId"
// are attached by the service layer, never trusted from the model.
export const AiInvestigationResultSchema = z.object({
  rootCause: z.string(),
  evidence: z.array(EvidenceItemSchema),
  confidence: z.number().min(0).max(100),
  fixSteps: z.array(z.string()),
  commands: z.array(z.string()),
  affectedFiles: z.array(z.string()),
  estimatedFixTime: z.string(),
  potentialSideEffects: z.array(z.string()),
});

export type AiInvestigationResult = z.infer<typeof AiInvestigationResultSchema>;
