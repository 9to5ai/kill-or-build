interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const value = Math.round((current / total) * 100);

  return (
    <div className="progress-wrap" aria-label={`Question ${current} of ${total}`}>
      <div className="progress-meta">
        <span>Question {current} of {total}</span>
        <span>{value}%</span>
      </div>
      <div className="progress-track" role="progressbar" aria-valuenow={current} aria-valuemin={1} aria-valuemax={total}>
        <div className="progress-fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
