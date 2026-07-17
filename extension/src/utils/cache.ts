import * as crypto from "crypto";

/**
 * Prevents Beacon from re-analyzing an unchanged file. Keyed on file path +
 * content hash so edits invalidate the entry automatically, without any
 * file-watcher bookkeeping.
 */
export class AnalysisCache<T> {
  private store = new Map<string, { hash: string; value: T }>();

  private hash(content: string): string {
    return crypto.createHash("sha1").update(content).digest("hex");
  }

  get(key: string, content: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    return entry.hash === this.hash(content) ? entry.value : undefined;
  }

  set(key: string, content: string, value: T): void {
    this.store.set(key, { hash: this.hash(content), value });
  }

  clear(): void {
    this.store.clear();
  }
}
