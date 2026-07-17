import React from "react";
import { InvestigationReport } from "../types";
import { Section } from "./Section";
import { ConfidenceMeter } from "./ConfidenceMeter";
import { EvidenceList } from "./EvidenceList";
import { CommandBlock } from "./CommandBlock";
import { CopyButton } from "./CopyButton";

export function InvestigationReportView({
  report,
}: {
  report: InvestigationReport;
}): React.ReactElement {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5 px-6 py-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          <h1 className="text-[13px] font-medium">Investigation complete</h1>
        </div>
        <span className="rounded border border-border px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted">
          {report.source === "static-analysis" ? "Static analysis" : "AI investigation"}
        </span>
      </header>

      <Section label="Root cause">
        <p className="text-[13px] leading-relaxed">{report.rootCause}</p>
      </Section>

      <Section label="Confidence">
        <ConfidenceMeter confidence={report.confidence} />
      </Section>

      <Section label="Evidence">
        <EvidenceList evidence={report.evidence} />
      </Section>

      {report.affectedFiles.length > 0 && (
        <Section label="Affected files">
          <ul className="flex flex-col gap-1">
            {report.affectedFiles.map((file) => (
              <li key={file} className="font-mono text-[12px] text-muted">
                {file}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {report.fixSteps.length > 0 && (
        <Section label="Recommended fix">
          <ol className="flex flex-col gap-1.5">
            {report.fixSteps.map((step, i) => (
              <li key={step} className="flex gap-2 text-[13px] leading-relaxed">
                <span className="text-muted">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {report.commands.length > 0 && (
        <Section label="Commands">
          <CommandBlock commands={report.commands} />
        </Section>
      )}

      <Section label="Estimated fix time">
        <p className="text-[13px]">{report.estimatedFixTime}</p>
      </Section>

      {report.potentialSideEffects.length > 0 && (
        <Section label="Potential side effects">
          <ul className="flex flex-col gap-1">
            {report.potentialSideEffects.map((effect) => (
              <li key={effect} className="text-[13px] text-muted">
                • {effect}
              </li>
            ))}
          </ul>
        </Section>
      )}

      <footer className="flex justify-end border-t border-border pt-4">
        <CopyButton text={JSON.stringify(report, null, 2)} />
      </footer>
    </div>
  );
}
