import { InvestigationContext } from '../schema/investigation';

export class ContextValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ContextValidationError';
  }
}

export function validateContextOrThrow(context: InvestigationContext): InvestigationContext {
  if (!context.workspace.rootPath && !context.file.path) {
    throw new ContextValidationError('Context is missing both workspace and file information.');
  }

  if (!context.file.path || context.file.path.trim() === '') {
    throw new ContextValidationError('Context is missing a current file path.');
  }

  if (!context.workspace.rootPath && context.manifests.length === 0) {
    throw new ContextValidationError('Context does not include enough project metadata to investigate.');
  }

  if (!context.file.languageId || context.file.languageId.trim() === '') {
    throw new ContextValidationError('Context is missing a detected language.');
  }

  return context;
}
