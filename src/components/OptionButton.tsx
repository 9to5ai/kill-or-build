interface OptionButtonProps {
  label: string;
  value: number;
  selected: boolean;
  disabled?: boolean;
  onSelect: () => void;
}

export function OptionButton({ label, value, selected, disabled = false, onSelect }: OptionButtonProps) {
  return (
    <button
      className={`option-button ${selected ? "selected" : ""}`}
      type="button"
      disabled={disabled}
      onClick={onSelect}
      aria-pressed={selected}
    >
      <span>{label}</span>
      <small>{value}</small>
    </button>
  );
}
