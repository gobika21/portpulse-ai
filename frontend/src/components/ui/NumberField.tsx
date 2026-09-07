interface NumberFieldProps {
  label: string;
  value: number;
  onChange?: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  suffix?: string;
  disabled?: boolean;
  hint?: string;
}

export function NumberField({
  label,
  value,
  onChange,
  step = 1,
  min,
  max,
  suffix,
  disabled = false,
  hint,
}: NumberFieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-wide text-ink-faint">{label}</span>
      <div
        className={`flex items-center rounded-sm border px-3 py-2 ${
          disabled ? "border-border bg-sunken" : "border-border bg-surface focus-within:border-accent"
        }`}
      >
        <input
          type="number"
          value={value}
          step={step}
          min={min}
          max={max}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.valueAsNumber || 0)}
          className="w-full bg-transparent text-sm text-ink outline-none disabled:text-ink-muted"
        />
        {suffix && <span className="text-xs text-ink-faint">{suffix}</span>}
      </div>
      {hint && <span className="text-[11px] text-ink-faint">{hint}</span>}
    </label>
  );
}
