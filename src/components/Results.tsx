import { dimensionLabels } from "../data/questions";
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

        <div className="restart-row">
          <button className="primary-button" onClick={onRestart}>Start over</button>
        </div>
      </section>
    </main>
  );
}
