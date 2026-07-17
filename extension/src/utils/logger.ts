type OutputChannelLike = {
  appendLine(message: string): void;
  dispose(): void;
};

type VSCodeLike = {
  window?: {
    createOutputChannel?: (name: string) => OutputChannelLike;
  };
};

/**
 * Thin wrapper around a dedicated VS Code output channel.
 * Never use console.log in this codebase - always go through here so
 * diagnostics show up in "Output > Beacon" like a first-party extension.
 * In non-extension contexts (tests, CLI) this degrades gracefully.
 */
class Logger {
  private channel: OutputChannelLike | undefined;

  init(): void {
    try {
      const vscode = this.loadVscode();
      this.channel = vscode.window?.createOutputChannel?.("Beacon");
    } catch {
      this.channel = undefined;
    }
  }

  private loadVscode(): VSCodeLike {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require("vscode") as VSCodeLike;
  }

  private write(level: string, message: string, meta?: unknown): void {
    const timestamp = new Date().toISOString();
    const suffix = meta !== undefined ? ` ${JSON.stringify(meta)}` : "";
    this.channel?.appendLine(`[${timestamp}] [${level}] ${message}${suffix}`);
  }

  info(message: string, meta?: unknown): void {
    this.write("INFO", message, meta);
  }

  warn(message: string, meta?: unknown): void {
    this.write("WARN", message, meta);
  }

  error(message: string, meta?: unknown): void {
    this.write("ERROR", message, meta);
  }

  dispose(): void {
    this.channel?.dispose();
  }
}

export const logger = new Logger();
