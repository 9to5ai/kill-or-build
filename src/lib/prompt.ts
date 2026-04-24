import { dimensionLabels } from "../data/questions";
import type { ScoreResult, Verdict } from "./scoring";

function formatList(items: string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

function formatDimensionScores(result: ScoreResult): string {
  return [
    `- ${dimensionLabels.problemStrength}: ${result.dimensions.problemStrength} / 100`,
    `- ${dimensionLabels.workflowReality}: ${result.dimensions.workflowReality} / 100`,
    `- ${dimensionLabels.economicValue}: ${result.dimensions.economicValue} / 100`,
    `- ${dimensionLabels.controlRisk}: ${result.dimensions.controlRisk} / 100`,
    `- ${dimensionLabels.executionReadiness}: ${result.dimensions.executionReadiness} / 100`,
  ].join("\n");
}

function resultHeader(result: ScoreResult) {
  return `I completed an AI project readiness assessment and received this verdict:

Verdict: ${result.verdict.toUpperCase()}
Score: ${result.totalScore} / 100

Dimension scores:
${formatDimensionScores(result)}

Top issues:
${formatList(result.topIssues)}

Recommendations:
${formatList(result.recommendations)}`;
}

const roleByVerdict: Record<Verdict, string> = {
  kill: "You are an expert AI product strategist and ruthless project reviewer.",
  redesign: "You are an expert AI product strategist and AI systems designer.",
  build: "You are an expert AI product strategist, product manager, and AI systems architect.",
};

const instructionByVerdict: Record<Verdict, string> = {
  kill: `Your job is to help me decide what to do next.

Do not try to rescue the idea by default. Be direct, practical, and skeptical.

Please produce:

1. A blunt diagnosis of why this project should not be built yet
2. The assumptions that are probably weakest
3. The minimum evidence I would need before reconsidering
4. Five sharper problem statements I could investigate instead
5. A 7-day validation plan that does not involve building software
6. Interview questions I should ask users/operators
7. Clear kill criteria so I know when to stop pursuing this

Keep the answer practical, specific, and concise. Avoid generic startup advice.`,
  redesign: `Your job is to help me reshape this into a better AI project.

Assume the opportunity may be real, but the current version is not build-ready.

Please produce:

1. A concise diagnosis of what is wrong with the current shape
2. A narrower version of the project that would be easier to build
3. The ideal first workflow, task loop, or user moment to target
4. The human-in-the-loop review points required
5. The data, tools, and integrations needed
6. The main risks and how to control them
7. A simple MVP scope that could be tested in 2–4 weeks
8. A list of what should explicitly be excluded from v1
9. Success metrics for deciding whether to continue

Be opinionated. Do not suggest a broad platform. Design the smallest useful version.`,
  build: `Your job is to turn this into a focused AI MVP plan.

Please produce:

1. A one-paragraph product concept
2. The narrowest valuable MVP scope
3. The user journey from start to finish
4. The AI role: assistant, copilot, automation, or agent
5. The required inputs, tools, data, and integrations
6. Human review and override points
7. Evaluation criteria for AI output quality
8. Main risks and mitigations
9. A 30-day build plan
10. A launch checklist
11. Metrics for deciding whether to expand, redesign, or kill after the pilot

Keep the plan practical. Avoid unnecessary platform features. Assume v1 should be narrow, measurable, and human-supervised.`,
};

export function generateMegaPrompt(result: ScoreResult): string {
  return `${roleByVerdict[result.verdict]}

${resultHeader(result)}

${instructionByVerdict[result.verdict]}`;
}
