import React from "react";

export function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <section className="flex flex-col gap-2 border-t border-border pt-4 first:border-t-0 first:pt-0">
      <h2 className="text-[11px] font-medium uppercase tracking-wider text-muted">{label}</h2>
      {children}
    </section>
  );
}
