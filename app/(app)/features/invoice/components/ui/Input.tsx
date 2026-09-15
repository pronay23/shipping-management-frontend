"use client";

interface InputProps {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
  type?: "text" | "date" | "number";
  full?: boolean;
  error?: string;
}

const baseClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none ring-sky-500/10 focus:border-sky-300 focus:ring";

export function Input({ id, label, value, onChange, onBlur, type = "text", full, error }: InputProps) {
  return (
    <label htmlFor={id} className={`space-y-2 text-sm text-slate-700 ${full ? "sm:col-span-2" : ""}`}>
      {label}
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur ? (e) => onBlur(e.target.value) : undefined}
        className={`${baseClass} ${error ? "border-red-300" : ""}`}
      />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </label>
  );
}