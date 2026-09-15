"use client";

import { useState } from "react";
import type { Voyage } from "../api/voyageApi";
import { downloadIgmXml, downloadEgmXml } from "../../manifest/api/generateManifestXml";

interface VoyageTableProps {
  voyages: Voyage[];
}

export default function VoyageTable({ voyages }: VoyageTableProps) {
  const [loadingId, setLoadingId] = useState<string | number | null>(null);
  const [loadingType, setLoadingType] = useState<"igm" | "egm" | null>(null);

  const handleDownload = async (
    voyageId: string | number,
    type: "igm" | "egm"
  ) => {
    setLoadingId(voyageId);
    setLoadingType(type);
    try {
      if (type === "igm") {
        await downloadIgmXml(voyageId);
      } else {
        await downloadEgmXml(voyageId);
      }
    } finally {
      setLoadingId(null);
      setLoadingType(null);
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      active: "bg-emerald-50 text-emerald-700 border-emerald-200",
      completed: "bg-sky-50 text-sky-700 border-sky-200",
      cancelled: "bg-red-50 text-red-600 border-red-200",
    };
    return map[status] ?? "bg-slate-50 text-slate-600 border-slate-200";
  };

  if (voyages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#D8D0BC] py-20 text-center">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#F1F5F9] font-mono text-xl font-semibold text-[#3E6990]">
          V
        </div>
        <p className="text-sm font-medium text-[#0B2542]">No voyages yet</p>
        <p className="mt-1 text-xs text-[#3E6990]">
          Create your first voyage to start generating IGM / EGM XML files.
        </p>
        <a
          href="/features/voyage/create"
          className="mt-4 rounded bg-[#0B2542] px-4 py-2 text-xs font-medium text-[#F1F5F9] transition hover:bg-[#123058]"
        >
          + New Voyage
        </a>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[900px] w-full text-sm">
        <thead>
          <tr className="border-b border-[#0B2542] text-left">
            {["Voyage No.", "Vessel", "Port of Loading", "Port of Discharge", "Departure", "Arrival", "Status", "Actions"].map((h) => (
              <th
                key={h}
                className="px-3 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-[#3E6990]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {voyages.map((voyage) => {
            const isLoading = loadingId === voyage.id;
            return (
              <tr
                key={voyage.id}
                className="border-b border-[#D8D0BC] transition-colors hover:bg-[#EDE8DA]"
              >
                <td className="px-3 py-3 font-mono text-[0.88rem] font-semibold text-[#0B2542]">
                  {voyage.voyage_number}
                </td>
                <td className="px-3 py-3 text-[0.88rem]">{voyage.vessel_name}</td>
                <td className="px-3 py-3 font-mono text-[0.82rem] text-[#3E6990]">
                  {voyage.port_of_loading ?? "—"}
                </td>
                <td className="px-3 py-3 font-mono text-[0.82rem] text-[#3E6990]">
                  {voyage.port_of_discharge ?? "—"}
                </td>
                <td className="px-3 py-3 text-[0.82rem]">
                  {voyage.departure_date ?? "—"}
                </td>
                <td className="px-3 py-3 text-[0.82rem]">
                  {voyage.arrival_date ?? "—"}
                </td>
                <td className="px-3 py-3">
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[0.7rem] font-semibold capitalize ${statusBadge(voyage.status)}`}
                  >
                    {voyage.status}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownload(voyage.id, "igm")}
                      disabled={isLoading}
                      className="rounded border border-[#0B2542] px-2.5 py-1 text-[0.7rem] font-semibold text-[#0B2542] transition hover:bg-[#0B2542] hover:text-white disabled:opacity-40"
                    >
                      {isLoading && loadingType === "igm" ? "..." : "IGM XML"}
                    </button>
                    <button
                      onClick={() => handleDownload(voyage.id, "egm")}
                      disabled={isLoading}
                      className="rounded border border-[#B9662E] px-2.5 py-1 text-[0.7rem] font-semibold text-[#B9662E] transition hover:bg-[#B9662E] hover:text-white disabled:opacity-40"
                    >
                      {isLoading && loadingType === "egm" ? "..." : "EGM XML"}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
