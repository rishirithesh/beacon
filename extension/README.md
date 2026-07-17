# Beacon

> Understand the cause, not the symptom.

Beacon is a context-aware diagnostics engine for developers, built as a VS Code extension.
It is not a chatbot. There is no prompt box and no message history — there is one command,
**Beacon: Investigate Error**, that silently gathers project context, runs local static
analysis, and only calls an LLM when no known pattern matches.

## Pipeline

```
Context Collection → Static Analysis → Known Rule Matching → (only if inconclusive) AI Investigation
```

Static analysis always runs first. Gemini is called only when every rule in the engine
returns "not applicable" — this is enforced in `InvestigationService.investigate()`, the
single choke point every code path goes through.

## Running it

```bash
npm install
npm run compile          # bundles the extension host to dist/extension.js
npm run build:webview    # builds the React report view to dist/webview/
```

Then press `F5` in VS Code (with this folder open) to launch an Extension Development Host,
or package it with `vsce package` once you're ready to distribute.

Set `beacon.gemini.apiKey` in Settings to enable the AI fallback. Without a key, Beacon still
works — it just returns a transparent, zero-confidence report when static analysis can't
explain the error, instead of silently failing.

## Architecture

Clean separation of concerns, one responsibility per layer:

```
src/
  schema/       Zod schemas - the single source of truth for every shape crossing a
                layer boundary (InvestigationContext, InvestigationReport)
  collectors/   Gather context silently: active file, terminal output, project
                manifests, environment metadata, workspace/framework detection
  analyzers/    Pure rule functions - context in, report or null out. Ten rules
                covering the MVP's static-diagnosis surface
  ai/           The ONLY layer allowed to call an LLM. promptBuilder.ts shapes the
                structured JSON request; geminiProvider.ts validates the structured
                JSON response against the schema before anything downstream sees it
  services/     InvestigationService orchestrates collectors → analyzers → AI,
                owns caching, and is the only thing commands ever call
  commands/     Thin VS Code command registration - no business logic
  webview/      Extension-host side of the report panel (postMessage bridge only)
webview-ui/     Separate React + Tailwind + Vite project rendering the report.
                Deliberately decoupled from extension/src - it only ever receives
                postMessage JSON, so it could be reused by a future non-VS Code client.
```

### Why this shape

- **Context First**: every collector runs without prompting the user. If Beacon can read
  it from disk, the terminal, or `node --version`, it does — the developer is never asked
  to paste a stack trace or describe their error.
- **Evidence over guesses**: `InvestigationReport.evidence` is a checklist of
  `{ label, satisfied }`, not a paragraph of hedging. Both static rules and the AI layer
  are constrained to the same schema, so the report always reads the same way regardless
  of which one produced it.
- **AI is the last step**: `runStaticAnalysis()` runs all ten rules synchronously, in
  order of signature specificity, before `InvestigationService` will even build a Gemini
  prompt.
- **Privacy**: `utils/redact.ts` strips anything that looks like a secret and refuses to
  read `.env*` files or anything under `node_modules/.git/dist/build`, enforced at the
  single point every file read passes through (`utils/fileSystem.ts`).
- **Future clients**: nothing in `collectors/`, `analyzers/`, `ai/`, or `services/`
  imports `vscode` in a way that couldn't be swapped for a CLI or JetBrains equivalent
  later — `vscode` calls are isolated to collectors (for reading files) and the
  command/webview glue.

## Static rules implemented (MVP)

| Rule | Detects |
|---|---|
| `port-already-occupied` | `EADDRINUSE` / address-in-use failures |
| `missing-npm-dependency` | `Cannot find module 'x'` not declared in `package.json` |
| `missing-python-package` | `ModuleNotFoundError` not declared in `requirements.txt` |
| `broken-ts-alias` | Path-alias imports missing from `tsconfig.json` `paths` |
| `missing-file` | `ENOENT` / `FileNotFoundError` |
| `permission-denied` | `EACCES` / permission-denied failures |
| `incorrect-node-version` | Active Node version below `package.json` `engines.node` |
| `incorrect-python-interpreter` | Python 2/3 syntax mismatches |
| `missing-environment-variable` | Errors referencing an unset env var |
| `configuration-mismatch` | ESM/CommonJS mismatches between source and `package.json` |

Framework detection (React/Next/Vue/Django/etc.) is implemented as context enrichment in
`collectors/workspaceCollector.ts` rather than as an eleventh rule — it isn't itself an
error condition, but every rule and the AI prompt both receive it as evidence.

## Not in the MVP

Anything not on the "Investigate Error" path — settings UI beyond the two Gemini
settings, multi-client support (CLI/JetBrains), and telemetry — is intentionally out of
scope, per the spec's instruction to ship one feature completely rather than several
half-built ones.
