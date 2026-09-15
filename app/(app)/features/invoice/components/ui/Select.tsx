"use client";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  id?: string;
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  full?: boolean;
  error?: string;
}

const baseClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none ring-sky-500/10 focus:border-sky-300 focus:ring";

export function Select({ id, label, value, options, onChange, full, error }: SelectProps) {
  return (
    <label htmlFor={id} className={`space-y-2 text-sm text-slate-700 ${full ? "sm:col-span-2" : ""}`}>
      {label}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${baseClass} ${error ? "border-red-300" : ""}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </label>
  );
}