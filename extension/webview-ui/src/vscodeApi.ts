/**
 * Thin typed wrapper around the acquireVsCodeApi() bridge. Kept in one file
 * so components never talk to the raw postMessage API directly.
 */
export interface VsCodeApi {
  postMessage(message: unknown): void;
}

declare function acquireVsCodeApi(): VsCodeApi;

let cached: VsCodeApi | undefined;

export function getVsCodeApi(): VsCodeApi {
  if (!cached) {
    cached = acquireVsCodeApi();
  }
  return cached;
}
