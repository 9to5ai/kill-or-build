import { useState } from "react";
import { questions } from "../data/questions";
import type { Answers } from "../lib/scoring";
import { OptionButton } from "./OptionButton";
import { ProgressBar } from "./ProgressBar";

interface AssessmentProps {
  answers: Answers;
  onAnswer: (questionId: string, value: number) => void;
  onComplete: () => void;
}

export function Assessment({ answers, onAnswer, onComplete }: AssessmentProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const currentQuestion = questions[currentIndex];
  const selectedValue = answers[currentQuestion.id];
  const isLastQuestion = currentIndex === questions.length - 1;

  function handleSelect(value: number) {
    if (isAdvancing) return;

    onAnswer(currentQuestion.id, value);
    setIsAdvancing(true);

    window.setTimeout(() => {
      if (isLastQuestion) {
        onComplete();
        return;
      }

      setCurrentIndex((index) => index + 1);
      setIsAdvancing(false);
    }, 200);
  }

  function handleBack() {
    if (isAdvancing || currentIndex === 0) return;
    setCurrentIndex((index) => index - 1);
  }

  return (
    <main className="page assessment-page">
      <section className="shell assessment-shell" aria-labelledby="question-title">
        <ProgressBar current={currentIndex + 1} total={questions.length} />

        <div className="question-card">
          <p className="question-dimension">{currentQuestion.dimension.replace(/([A-Z])/g, " $1").trim()}</p>
          <h1 id="question-title">{currentQuestion.text}</h1>
          <div className="options-grid" role="list" aria-label="Answer options">
            {currentQuestion.options.map((option) => (
              <OptionButton
                key={option.label}
                label={option.label}
                value={option.value}
                selected={selectedValue === option.value}
                disabled={isAdvancing}
                onSelect={() => handleSelect(option.value)}
              />
            ))}
          </div>
        </div>

        <div className="assessment-footer">
          <button className="secondary-button" type="button" onClick={handleBack} disabled={currentIndex === 0 || isAdvancing}>
            Back
          </button>
          <p>{isLastQuestion ? "Last one. Answer and get the verdict." : "Pick the answer closest to reality."}</p>
        </div>
      </section>
    </main>
  );
}
