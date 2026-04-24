import { useState } from "react";
import { Assessment } from "./components/Assessment";
import { Home } from "./components/Home";
import { Results } from "./components/Results";
import type { Answers } from "./lib/scoring";

type AppStage = "home" | "assessment" | "results";

export default function App() {
  const [stage, setStage] = useState<AppStage>("home");
  const [answers, setAnswers] = useState<Answers>({});

  function startAssessment() {
    setAnswers({});
    setStage("assessment");
  }

  function answerQuestion(questionId: string, value: number) {
    setAnswers((current) => ({ ...current, [questionId]: value }));
  }

  function showResults() {
    setStage("results");
  }

  function restart() {
    setAnswers({});
    setStage("home");
  }

  if (stage === "assessment") {
    return <Assessment answers={answers} onAnswer={answerQuestion} onComplete={showResults} />;
  }

  if (stage === "results") {
    return <Results answers={answers} onRestart={restart} />;
  }

  return <Home onStart={startAssessment} />;
}
