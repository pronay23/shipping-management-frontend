"use client";

interface AuthFieldProps {
  label: string;
  type?: "text" | "email" | "date" | "password";
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  full?: boolean;
  textarea?: boolean;
  error?: string;
}

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-sky-500/10 focus:border-sky-300 focus:ring";

export function AuthField({
  label,
  type = "text",
  value,
  onChange,
  required,
  full,
  textarea,
  error,
}: AuthFieldProps) {
  return (
    <label className={`space-y-2 text-sm text-slate-700 ${full ? "sm:col-span-2" : ""}`}>
      {label}
      {required ? <span className="text-red-500"> *</span> : null}
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className={`${inputClass} resize-y`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        />
      )}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </label>
  );
}