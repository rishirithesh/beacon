import * as vscode from "vscode";

const MAX_BUFFER_CHARS = 6000;

/**
 * Buffers recent shell output per-terminal via the Terminal Shell Integration
 * API so Beacon has terminal context the instant "Investigate" is clicked,
 * without ever prompting the developer to paste anything.
 */
class TerminalOutputBuffer {
  private buffers = new Map<vscode.Terminal, string>();
  private disposables: vscode.Disposable[] = [];

  activate(): void {
    if (!("onDidStartTerminalShellExecution" in vscode.window)) return;

    const startListener = vscode.window.onDidStartTerminalShellExecution(async (event) => {
      try {
        const stream = event.execution.read();
        let buffer = this.buffers.get(event.terminal) ?? "";
        for await (const chunk of stream) {
          buffer += chunk;
          if (buffer.length > MAX_BUFFER_CHARS) {
            buffer = buffer.slice(buffer.length - MAX_BUFFER_CHARS);
          }
        }
        this.buffers.set(event.terminal, buffer);
      } catch {
        // Shell integration not supported by the user's shell - degrade silently.
      }
    });

    this.disposables.push(startListener);
  }

  latestFor(terminal: vscode.Terminal | undefined): string | null {
    if (!terminal) return null;
    return this.buffers.get(terminal) ?? null;
  }

  dispose(): void {
    this.disposables.forEach((d) => d.dispose());
  }
}

export const terminalOutputBuffer = new TerminalOutputBuffer();

export function collectTerminalOutput(): string | null {
  return terminalOutputBuffer.latestFor(vscode.window.activeTerminal);
}
