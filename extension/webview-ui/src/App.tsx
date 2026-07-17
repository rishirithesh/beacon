import React, { useEffect, useState } from "react";
import { HostMessage, InvestigationReport } from "./types";
import { InvestigationReportView } from "./components/InvestigationReportView";
import { EmptyState } from "./components/EmptyState";
import { LoadingState } from "./components/LoadingState";

type ViewState =
  | { kind: "empty" }
  | { kind: "loading" }
  | { kind: "report"; report: InvestigationReport }
  | { kind: "error"; message: string };

export function App(): React.ReactElement {
  const [state, setState] = useState<ViewState>({ kind: "empty" });

  useEffect(() => {
    const handler = (event: MessageEvent<HostMessage>): void => {
      const message = event.data;
      if (message.type === "loading") setState({ kind: "loading" });
      if (message.type === "report") setState({ kind: "report", report: message.payload });
      if (message.type === "error") setState({ kind: "error", message: message.payload });
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <div className="min-h-screen">
      {state.kind === "empty" && <EmptyState />}
      {state.kind === "loading" && <LoadingState />}
      {state.kind === "report" && <InvestigationReportView report={state.report} />}
      {state.kind === "error" && (
        <div className="p-6">
          <p className="text-sm text-red-400">Beacon couldn't complete the investigation.</p>
          <p className="mt-2 text-xs text-muted">{state.message}</p>
        </div>
      )}
    </div>
  );
}
