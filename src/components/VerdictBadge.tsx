import type { Verdict } from "../lib/scoring";

const verdictLabels: Record<Verdict, string> = {
  kill: "Kill",
  redesign: "Redesign",
  build: "Build",
};

interface VerdictBadgeProps {
  verdict: Verdict;
}

export function VerdictBadge({ verdict }: VerdictBadgeProps) {
  return <span className={`verdict-badge ${verdict}`}>{verdictLabels[verdict]}</span>;
}
