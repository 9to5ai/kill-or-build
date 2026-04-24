import { useMemo, useState } from "react";
import { dimensionLabels } from "../data/questions";
import { generateMegaPrompt } from "../lib/prompt";
import { calculateResult, type Answers, type Dimension } from "../lib/scoring";
import { VerdictBadge } from "./VerdictBadge";

interface ResultsProps {
  answers: Answers;
  onRestart: () => void;
}

const dimensionOrder: Dimension[] = [
  "problemStrength",
  "economicValue",
  "controlRisk",
  "workflowReality",
  "executionReadiness",
];

const verdictHeadlines = {
  kill: "Kill it.",
  redesign: "Redesign it.",
  build: "Build it.",
};

export function Results({ answers, onRestart }: ResultsProps) {
  const result = calculateResult(answers);
  const megaPrompt = useMemo(() => generateMegaPrompt(result), [result]);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

  async function handleCopyPrompt() {
    try {
      await navigator.clipboard.writeText(megaPrompt);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      setCopyState("failed");
    }
  }

  return (
    <main className="page results-page">
      <section className="shell results-shell" aria-labelledby="results-title">
        <div className="result-hero">
          <VerdictBadge verdict={result.verdict} />
          <h1 id="results-title">{verdictHeadlines[result.verdict]}</h1>
          <p>{result.summary}</p>
          <div className="score-card" aria-label={`Score ${result.totalScore} out of 100`}>
            <span>{result.totalScore}</span>
            <small>/ 100</small>
          </div>
        </div>

        <div className="result-grid">
          <section className="panel dimension-panel" aria-labelledby="dimensions-title">
            <h2 id="dimensions-title">Dimension breakdown</h2>
            <div className="dimension-list">
              {dimensionOrder.map((dimension) => (
                <div className="dimension-row" key={dimension}>
                  <div className="dimension-label">
                    <span>{dimensionLabels[dimension]}</span>
                    <strong>{result.dimensions[dimension]}</strong>
                  </div>
                  <div className="mini-track" aria-hidden="true">
                    <div style={{ width: `${result.dimensions[dimension]}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="panel" aria-labelledby="issues-title">
            <h2 id="issues-title">Top issues</h2>
            <ol className="insight-list">
              {result.topIssues.map((issue) => (
                <li key={issue}>{issue}</li>
              ))}
            </ol>
          </section>

          <section className="panel recommendations-panel" aria-labelledby="recommendations-title">
            <h2 id="recommendations-title">Recommendations</h2>
            <ol className="insight-list">
              {result.recommendations.map((recommendation) => (
                <li key={recommendation}>{recommendation}</li>
              ))}
            </ol>
          </section>
        </div>

        <section className="panel prompt-panel" aria-labelledby="prompt-title">
          <div className="prompt-header">
            <div>
              <h2 id="prompt-title">Your next prompt</h2>
              <p>Paste this into an AI assistant to turn your verdict into a concrete action plan.</p>
            </div>
            <div className="copy-cluster">
              <button className="secondary-button copy-button" type="button" onClick={() => void handleCopyPrompt()}>
                Copy prompt
              </button>
              <span className={`copy-status ${copyState !== "idle" ? "visible" : ""}`} aria-live="polite">
                {copyState === "copied" ? "Copied." : copyState === "failed" ? "Copy failed." : ""}
              </span>
            </div>
          </div>
          <pre className="prompt-card"><code>{megaPrompt}</code></pre>
          <p className="prompt-note">
            This prompt is generated from your assessment result. Edit it with your project context before using.
          </p>
        </section>

        <div className="restart-row">
          <button className="primary-button" onClick={onRestart}>Start over</button>
        </div>
      </section>
    </main>
  );
}
