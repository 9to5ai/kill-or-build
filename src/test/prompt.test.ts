import { describe, expect, it } from "vitest";
import { generateMegaPrompt } from "../lib/prompt";
import type { ScoreResult } from "../lib/scoring";

const baseResult: ScoreResult = {
  verdict: "redesign",
  totalScore: 67,
  dimensions: {
    problemStrength: 78,
    workflowReality: 44,
    economicValue: 67,
    controlRisk: 52,
    executionReadiness: 61,
  },
  topIssues: [
    "Workflow is not clear enough — AI will amplify a fuzzy process, not fix it.",
    "Risk controls are weak — review, override, and audit paths need to be explicit.",
    "Execution readiness is shaky — ownership, data, or timing will probably stall it.",
  ],
  recommendations: [
    "Map the workflow from trigger to final outcome. If the path is fuzzy, AI will amplify the mess.",
    "Add human review, override, and auditability before automation. This should be redesigned before implementation.",
    "Assign one accountable owner and confirm data access before any prototype work starts.",
  ],
  summary: "The opportunity exists, but the current shape is not build-ready.",
};

function resultFor(verdict: ScoreResult["verdict"], score = baseResult.totalScore): ScoreResult {
  return {
    ...baseResult,
    verdict,
    totalScore: score,
  };
}

describe("generateMegaPrompt", () => {
  it("returns a non-empty string", () => {
    expect(generateMegaPrompt(baseResult).trim().length).toBeGreaterThan(0);
  });

  it("includes the kill verdict", () => {
    expect(generateMegaPrompt(resultFor("kill", 33))).toContain("Verdict: KILL");
  });

  it("includes the redesign verdict", () => {
    expect(generateMegaPrompt(resultFor("redesign", 67))).toContain("Verdict: REDESIGN");
  });

  it("includes the build verdict", () => {
    expect(generateMegaPrompt(resultFor("build", 88))).toContain("Verdict: BUILD");
  });

  it("includes the total score", () => {
    expect(generateMegaPrompt(resultFor("build", 88))).toContain("Score: 88 / 100");
  });

  it("includes all five public-facing dimension scores", () => {
    const prompt = generateMegaPrompt(baseResult);

    expect(prompt).toContain("Problem Strength: 78 / 100");
    expect(prompt).toContain("Operating Reality: 44 / 100");
    expect(prompt).toContain("Economic Value: 67 / 100");
    expect(prompt).toContain("Control & Risk: 52 / 100");
    expect(prompt).toContain("Execution Readiness: 61 / 100");
  });

  it("includes top issues", () => {
    const prompt = generateMegaPrompt(baseResult);

    for (const issue of baseResult.topIssues) {
      expect(prompt).toContain(issue);
    }
  });

  it("includes recommendations", () => {
    const prompt = generateMegaPrompt(baseResult);

    for (const recommendation of baseResult.recommendations) {
      expect(prompt).toContain(recommendation);
    }
  });

  it("uses different prompts for kill, redesign, and build", () => {
    const killPrompt = generateMegaPrompt(resultFor("kill", 33));
    const redesignPrompt = generateMegaPrompt(resultFor("redesign", 67));
    const buildPrompt = generateMegaPrompt(resultFor("build", 88));

    expect(killPrompt).not.toEqual(redesignPrompt);
    expect(redesignPrompt).not.toEqual(buildPrompt);
    expect(killPrompt).not.toEqual(buildPrompt);
  });
});
