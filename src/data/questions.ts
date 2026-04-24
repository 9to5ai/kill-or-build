export type Dimension =
  | "problemStrength"
  | "workflowReality"
  | "economicValue"
  | "controlRisk"
  | "executionReadiness";

export interface QuestionOption {
  label: string;
  value: 1 | 2 | 3 | 4;
}

export interface Question {
  id: `q${number}`;
  dimension: Dimension;
  text: string;
  options: readonly QuestionOption[];
}

export const dimensionLabels: Record<Dimension, string> = {
  problemStrength: "Problem Strength",
  workflowReality: "Operating Reality",
  economicValue: "Economic Value",
  controlRisk: "Control & Risk",
  executionReadiness: "Execution Readiness",
};

export const questions = [
  {
    id: "q1",
    dimension: "problemStrength",
    text: "How often does this problem occur?",
    options: [
      { label: "Rare", value: 1 },
      { label: "Weekly", value: 2 },
      { label: "Daily", value: 3 },
      { label: "Constant", value: 4 },
    ],
  },
  {
    id: "q2",
    dimension: "problemStrength",
    text: "What is the impact of this problem?",
    options: [
      { label: "Minor inconvenience", value: 1 },
      { label: "Noticeable inefficiency", value: 2 },
      { label: "Significant cost or time", value: 3 },
      { label: "Critical business impact", value: 4 },
    ],
  },
  {
    id: "q3",
    dimension: "workflowReality",
    text: "Does a workaround already exist today?",
    options: [
      { label: "No workaround", value: 1 },
      { label: "Informal manual workaround", value: 2 },
      { label: "Structured but inefficient workaround", value: 3 },
      { label: "Well-defined process", value: 4 },
    ],
  },
  {
    id: "q4",
    dimension: "workflowReality",
    text: "Is the task environment clearly defined?",
    options: [
      { label: "No", value: 1 },
      { label: "Partially", value: 2 },
      { label: "Mostly", value: 3 },
      { label: "Fully clear", value: 4 },
    ],
  },
  {
    id: "q5",
    dimension: "workflowReality",
    text: "Are the key decisions, exceptions, and handoffs clearly identified?",
    options: [
      { label: "No", value: 1 },
      { label: "Somewhat", value: 2 },
      { label: "Mostly", value: 3 },
      { label: "Clearly defined", value: 4 },
    ],
  },
  {
    id: "q6",
    dimension: "economicValue",
    text: "Can you estimate the current cost or time of this process?",
    options: [
      { label: "No idea", value: 1 },
      { label: "Rough guess", value: 2 },
      { label: "Moderate confidence", value: 3 },
      { label: "High confidence", value: 4 },
    ],
  },
  {
    id: "q7",
    dimension: "economicValue",
    text: "What is the expected impact of AI on this workflow?",
    options: [
      { label: "Minimal", value: 1 },
      { label: "Moderate", value: 2 },
      { label: "Significant", value: 3 },
      { label: "Transformational", value: 4 },
    ],
  },
  {
    id: "q8",
    dimension: "controlRisk",
    text: "Can AI decisions be reviewed or overridden easily?",
    options: [
      { label: "No", value: 1 },
      { label: "Difficult", value: 2 },
      { label: "Possible", value: 3 },
      { label: "Built-in", value: 4 },
    ],
  },
  {
    id: "q9",
    dimension: "controlRisk",
    text: "Can outcomes be audited or explained if challenged?",
    options: [
      { label: "No", value: 1 },
      { label: "Partially", value: 2 },
      { label: "Mostly", value: 3 },
      { label: "Fully", value: 4 },
    ],
  },
  {
    id: "q10",
    dimension: "executionReadiness",
    text: "Is there a clear owner responsible for this project?",
    options: [
      { label: "No", value: 1 },
      { label: "Informal owner", value: 2 },
      { label: "Assigned owner", value: 3 },
      { label: "Fully accountable owner", value: 4 },
    ],
  },
  {
    id: "q11",
    dimension: "executionReadiness",
    text: "Are the required data, tools, or systems accessible?",
    options: [
      { label: "No", value: 1 },
      { label: "Difficult", value: 2 },
      { label: "Mostly", value: 3 },
      { label: "Ready", value: 4 },
    ],
  },
  {
    id: "q12",
    dimension: "executionReadiness",
    text: "How likely is this to be implemented within 3 months?",
    options: [
      { label: "Very unlikely", value: 1 },
      { label: "Uncertain", value: 2 },
      { label: "Likely", value: 3 },
      { label: "Highly likely", value: 4 },
    ],
  },
] as const satisfies readonly Question[];
