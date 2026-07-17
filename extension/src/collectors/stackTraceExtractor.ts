/**
 * Beacon does not ask the developer to paste a stack trace. Instead it
 * extracts the most recent error-shaped block from whatever terminal output
 * was already collected. Pure function, no I/O - kept separate from
 * terminalCollector so it can be unit tested without a VS Code host.
 */
const ERROR_START_PATTERNS = [
  /^Traceback \(most recent call last\):/m,
  /^[\w.]*Error(?::| \[)/m,
  /^\s*at .+\(.+:\d+:\d+\)/m,
  /panicked at/m,
  /Unhandled Rejection/m,
];

export function extractStackTrace(terminalOutput: string | null): string | null {
  if (!terminalOutput) return null;

  for (const pattern of ERROR_START_PATTERNS) {
    const match = pattern.exec(terminalOutput);
    if (match) {
      const startIndex = match.index;
      return terminalOutput.slice(startIndex).slice(0, 3000).trim();
    }
  }
  return null;
}
