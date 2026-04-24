import { describe, expect, it } from "vitest";
import { questions } from "../data/questions";
import { calculateResult, type Answers } from "../lib/scoring";

const allAnswers = (value: number): Answers =>
  Object.fromEntries(Array.from({ length: 12 }, (_, i) => [`q${i + 1}`, value]));

describe("questions", () => {
  it("uses exactly 12 four-option multiple-choice questions", () => {
    expect(questions).toHaveLength(12);

    for (const question of questions) {
      expect(question.options).toHaveLength(4);
      expect(question.options.map((option) => option.value)).toEqual([1, 2, 3, 4]);
      expect(question.dimension).toMatch(/problemStrength|workflowReality|economicValue|controlRisk|executionReadiness/);
    }
  });
});

describe("calculateResult", () => {
  it("returns kill for all low answers", () => {
    const result = calculateResult(allAnswers(1));

    expect(result.verdict).toBe("kill");
    expect(result.totalScore).toBeLessThan(50);
  });

  it("returns build for all high answers", () => {
    const result = calculateResult(allAnswers(4));

    expect(result.verdict).toBe("build");
    expect(result.totalScore).toBe(100);
  });

  it("returns kill when the problem is weak even if other areas are strong", () => {
    const answers = {
      ...allAnswers(4),
      q1: 1,
      q2: 2,
    };

    const result = calculateResult(answers);

    expect(result.verdict).toBe("kill");
    expect(result.dimensions.problemStrength).toBeLessThan(45);
  });

  it("returns redesign, not build, when control and risk are weak", () => {
    const answers = {
      ...allAnswers(4),
      q8: 2,
      q9: 2,
    };

    const result = calculateResult(answers);

    expect(result.verdict).toBe("redesign");
    expect(result.totalScore).toBeGreaterThanOrEqual(74);
  });

  it("returns redesign for a mid-score project", () => {
    const result = calculateResult(allAnswers(3));

    expect(result.verdict).toBe("redesign");
    expect(result.totalScore).toBeGreaterThanOrEqual(50);
    expect(result.totalScore).toBeLessThan(74);
  });

  it("returns kill when there is no owner and data is difficult", () => {
    const answers = {
      ...allAnswers(4),
      q10: 1,
      q11: 2,
    };

    const result = calculateResult(answers);

    expect(result.verdict).toBe("kill");
  });

  it("always returns a complete result shape", () => {
    const result = calculateResult(allAnswers(3));

    expect(["kill", "redesign", "build"]).toContain(result.verdict);
    expect(result.totalScore).toBeGreaterThanOrEqual(0);
    expect(result.totalScore).toBeLessThanOrEqual(100);
    expect(Object.keys(result.dimensions).sort()).toEqual([
      "controlRisk",
      "economicValue",
      "executionReadiness",
      "problemStrength",
      "workflowReality",
    ]);
    expect(result.topIssues).toHaveLength(3);
    expect(result.recommendations).toHaveLength(3);
    expect(result.summary.length).toBeGreaterThan(0);
  });
});
