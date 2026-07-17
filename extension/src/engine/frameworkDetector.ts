import { InvestigationContext } from '../schema/investigation';

export interface FrameworkDetection {
  framework: string;
  confidence: number;
}

export function detectFramework(context: InvestigationContext): FrameworkDetection {
  const manifests = context.manifests.map((manifest) => manifest.contentSnippet.toLowerCase());

  if (manifests.some((manifest) => manifest.includes('"react"'))) {
    return { framework: 'react', confidence: 86 };
  }

  if (manifests.some((manifest) => manifest.includes('"next"'))) {
    return { framework: 'next', confidence: 84 };
  }

  if (manifests.some((manifest) => manifest.includes('flask'))) {
    return { framework: 'flask', confidence: 80 };
  }

  if (context.file.languageId.toLowerCase().includes('python')) {
    return { framework: 'python', confidence: 67 };
  }

  return { framework: 'unknown', confidence: 30 };
}
