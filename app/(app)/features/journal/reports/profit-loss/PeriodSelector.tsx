"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function padMonth(year: number, month: number, last = false): string {
  const d = new Date(year, last ? month + 1 : month, last ? 0 : 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = last ? String(d.getDate()).padStart(2, "0") : "01";
  return `${y}-${m}-${day}`;
}

function years(): number[] {
  const current = new Date().getFullYear();
  return Array.from({ length: 6 }, (_, i) => current - i);
}

export default function PeriodSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentFrom = searchParams.get("from") ?? "";
  const currentTo = searchParams.get("to") ?? "";

  const { selectedYear, selectedMonth } = useMemo(() => {
    if (currentFrom && currentTo) {
      const fromDate = new Date(currentFrom);
      const toDate = new Date(currentTo);
      const fromMonth = fromDate.getMonth();
      const toMonth = toDate.getMonth();
      if (
        fromDate.getFullYear() === toDate.getFullYear() &&
        fromMonth === toMonth &&
        fromDate.getDate() === 1 &&
        toDate.getDate() === new Date(toDate.getFullYear(), toMonth + 1, 0).getDate()
      ) {
        return { selectedYear: fromDate.getFullYear(), selectedMonth: fromMonth };
      }
      return { selectedYear: new Date().getFullYear(), selectedMonth: -1 };
    }
    return { selectedYear: new Date().getFullYear(), selectedMonth: -1 };
  }, [currentFrom, currentTo]);

  const push = useCallback(
    (year: number, month: number) => {
      const params = new URLSearchParams();
      params.set("from", padMonth(year, month));
      params.set("to", padMonth(year, month, true));
      router.push(`/features/journal/reports/profit-loss?${params.toString()}`);
    },
    [router]
  );

  const pushYear = useCallback(
    (year: number) => {
      const params = new URLSearchParams();
      params.set("from", `${year}-01-01`);
      params.set("to", `${year}-12-31`);
      router.push(`/features/journal/reports/profit-loss?${params.toString()}`);
    },
    [router]
  );

  const pushAll = useCallback(() => {
    router.push("/features/journal/reports/profit-loss");
  }, [router]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="text-sm font-medium text-slate-600">Year</label>
      <select
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        value={selectedYear}
        onChange={(e) => {
          const year = Number(e.target.value);
          pushYear(year);
        }}
      >
        {years().map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>

      <label className="text-sm font-medium text-slate-600">Month</label>
      <select
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        value={selectedMonth}
        onChange={(e) => {
          const month = Number(e.target.value);
          if (month === -1) {
            pushYear(selectedYear);
          } else {
            push(selectedYear, month);
          }
        }}
      >
        <option value={-1}>All months</option>
        {MONTHS.map((name, i) => (
          <option key={name} value={i}>
            {name}
          </option>
        ))}
      </select>

      {currentFrom || currentTo ? (
        <button
          type="button"
          onClick={pushAll}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        >
          Reset
        </button>
      ) : null}
    </div>
  );
}
