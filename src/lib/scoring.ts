import { questions, type Dimension } from "../data/questions";

export type { Dimension };
export type Verdict = "kill" | "redesign" | "build";
export type Answers = Record<string, number>;

export interface ScoreResult {
  verdict: Verdict;
  totalScore: number;
  dimensions: Record<Dimension, number>;
  topIssues: string[];
  recommendations: string[];
  summary: string;
}

const dimensions: Dimension[] = [
  "problemStrength",
  "workflowReality",
  "economicValue",
  "controlRisk",
  "executionReadiness",
];

const dimensionWeights: Record<Dimension, number> = {
  problemStrength: 1.5,
  economicValue: 1.5,
  controlRisk: 1.3,
  workflowReality: 1.0,
  executionReadiness: 1.0,
};

const issueCopy: Record<Dimension, string> = {
  problemStrength: "Problem signal is weak — prove it happens often and hurts enough before you build.",
  workflowReality: "Workflow is not clear enough — AI will amplify a fuzzy process, not fix it.",
  economicValue: "Economic value is unclear — estimate current time, cost, or error rate first.",
  controlRisk: "Risk controls are weak — review, override, and audit paths need to be explicit.",
  executionReadiness: "Execution readiness is shaky — ownership, data, or timing will probably stall it.",
};

const recommendationCopy: Record<Dimension, string> = {
  problemStrength: "Do not build yet. First, prove the problem happens often enough and hurts enough.",
  workflowReality: "Map the workflow from trigger to final outcome. If the path is fuzzy, AI will amplify the mess.",
  economicValue: "Estimate current time, cost, or error rate before building. If you cannot measure the pain, you cannot defend the project.",
  controlRisk: "Add human review, override, and auditability before automation. This should be redesigned before implementation.",
  executionReadiness: "Assign one accountable owner and confirm data access before any prototype work starts.",
};

const verdictSummaries: Record<Verdict, string> = {
  kill: "The signal is too weak to justify building this now.",
  redesign: "The opportunity exists, but the current shape is not build-ready.",
  build: "This has enough pain, value, control, and readiness to justify a focused MVP.",
};

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function normalize(averageScore: number) {
  return Math.round(((averageScore - 1) / 3) * 100);
}

export function getDimensionScores(answers: Answers): Record<Dimension, number> {
  return Object.fromEntries(
    dimensions.map((dimension) => {
      const values = questions
        .filter((question) => question.dimension === dimension)
        .map((question) => answers[question.id] ?? 1);

      return [dimension, normalize(average(values))];
    }),
  ) as Record<Dimension, number>;
}

export function getTotalScore(dimensionScores: Record<Dimension, number>) {
  const weightTotal = dimensions.reduce((sum, dimension) => sum + dimensionWeights[dimension], 0);
  const weightedTotal = dimensions.reduce(
    (sum, dimension) => sum + dimensionScores[dimension] * dimensionWeights[dimension],
    0,
  );

  return Math.round(weightedTotal / weightTotal);
}

export function getVerdict(
  answers: Answers,
  totalScore: number,
  dimensionScores: Record<Dimension, number>,
): Verdict {
  const { problemStrength, economicValue, workflowReality, controlRisk, executionReadiness } = dimensionScores;

  if (
    totalScore < 50 ||
    problemStrength < 45 ||
    economicValue < 45 ||
    ((answers.q1 ?? 1) <= 2 && (answers.q2 ?? 1) <= 2) ||
    ((answers.q10 ?? 1) === 1 && (answers.q11 ?? 1) <= 2)
  ) {
    return "kill";
  }

  const buildReady =
    totalScore >= 74 &&
    problemStrength >= 60 &&
    economicValue >= 60 &&
    workflowReality >= 55 &&
    controlRisk >= 55 &&
    executionReadiness >= 55 &&
    (answers.q8 ?? 1) >= 3 &&
    (answers.q9 ?? 1) >= 3 &&
    (answers.q10 ?? 1) >= 3 &&
    (answers.q11 ?? 1) >= 3;

  if (buildReady) return "build";

  return "redesign";
}

export function getTopIssues(dimensionScores: Record<Dimension, number>): string[] {
  return [...dimensions]
    .sort((a, b) => dimensionScores[a] - dimensionScores[b])
    .slice(0, 3)
    .map((dimension) => issueCopy[dimension]);
}

export function getRecommendations(
  verdict: Verdict,
  answers: Answers,
  dimensionScores: Record<Dimension, number>,
): string[] {
  const weakestRecommendations = [...dimensions]
    .sort((a, b) => dimensionScores[a] - dimensionScores[b])
    .map((dimension) => recommendationCopy[dimension]);

  const specific: string[] = [];

  if ((answers.q8 ?? 4) <= 2 || (answers.q9 ?? 4) <= 2) {
    specific.push("Define human review, override, and audit trails before anyone writes production code.");
  }

  if ((answers.q10 ?? 4) < 3 || (answers.q11 ?? 4) < 3) {
    specific.push("Name one accountable owner and confirm the required data is usable before starting a prototype.");
  }

  if (verdict === "build") {
    specific.push("Build the smallest workflow slice, keep human review in version one, and ship a pilot within 30 days.");
    specific.push("Define success metrics before implementation. Do not let this become a platform project.");
  }

  if (verdict === "kill") {
    specific.push("Do not start with a prototype. Find a sharper problem and measure the current cost first.");
  }

  if (verdict === "redesign") {
    specific.push("Build a manual version first. Narrow the workflow until the trigger, decisions, and handoff are obvious.");
  }

  return [...specific, ...weakestRecommendations].filter((item, index, arr) => arr.indexOf(item) === index).slice(0, 3);
}

export function calculateResult(answers: Answers): ScoreResult {
  const dimensionScores = getDimensionScores(answers);
  const totalScore = getTotalScore(dimensionScores);
  const verdict = getVerdict(answers, totalScore, dimensionScores);

  return {
    verdict,
    totalScore,
    dimensions: dimensionScores,
    topIssues: getTopIssues(dimensionScores),
    recommendations: getRecommendations(verdict, answers, dimensionScores),
    summary: verdictSummaries[verdict],
  };
}
