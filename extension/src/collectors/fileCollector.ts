import * as vscode from "vscode";
import { FileContext } from "../schema/investigation";
import { truncate } from "../utils/redact";

/** Collects the active file, current selection, and language - the most direct evidence. */
export function collectFileContext(editor: vscode.TextEditor | undefined): FileContext {
  if (!editor) {
    return { path: "unknown", languageId: "unknown", selection: null, fullContentSnippet: null };
  }
  const selection = editor.selection.isEmpty
    ? null
    : editor.document.getText(editor.selection);
  const fullContentSnippet = truncate(editor.document.getText(), 4000);
  return {
    path: vscode.workspace.asRelativePath(editor.document.uri),
    languageId: editor.document.languageId,
    selection,
    fullContentSnippet,
  };
}
