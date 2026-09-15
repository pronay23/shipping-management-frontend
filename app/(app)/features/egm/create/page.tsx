"use client";

import { useState, useEffect } from "react";
import { getVoyageList, Voyage } from "../../voyage/api/voyageApi";
import { downloadEgmXml } from "../../manifest/api/generateManifestXml";

export default function EgmCreatePage() {
  const [voyages, setVoyages] = useState<Voyage[]>([]);
  const [selectedVoyageId, setSelectedVoyageId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    getVoyageList()
      .then((v) => {
        setVoyages(v);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const handleGenerate = async () => {
    if (!selectedVoyageId) return;
    setIsGenerating(true);
    try {
      await downloadEgmXml(selectedVoyageId);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-[#16212B]">
      <header className="border-b border-[#D8D0BC] bg-[#0B2542] text-[#F1F5F9]">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#F1F5F9] bg-transparent font-mono text-sm font-semibold">
              E
            </div>
            <div>
              <h1 className="font-serif text-xl font-semibold leading-tight">
                Generate EGM
              </h1>
              <p className="font-mono text-xs text-[#B9C6D6]">
                Select a Voyage to generate the Export General Manifest XML
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <section className="rounded-lg border border-[#D8D0BC] bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#0B2542] bg-[#F1F5F9] font-mono text-sm font-semibold text-[#0B2542]">
              01
            </div>
            <h2 className="font-serif text-[1.05rem] font-semibold text-[#0B2542]">
              Select Voyage
            </h2>
          </div>
          
          <div className="max-w-md">
            <label className="block text-sm">
              <span className="mb-1 block text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-[#3E6990]">
                Voyage
              </span>
              <select
                className="w-full cursor-pointer border-0 border-b border-[#D8D0BC] bg-transparent px-0 py-2 text-[0.92rem] text-[#16212B] outline-none transition focus:border-[#B9662E]"
                value={selectedVoyageId}
                onChange={(e) => setSelectedVoyageId(e.target.value)}
                disabled={isLoading}
              >
                <option value="">
                  {isLoading ? "Loading voyages..." : "Select a Voyage"}
                </option>
                {voyages.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.vessel_name} - {v.voyage_number}
                  </option>
                ))}
              </select>
            </label>
            
            <div className="mt-8">
              <button
                onClick={handleGenerate}
                disabled={!selectedVoyageId || isGenerating}
                className="rounded bg-[#0B2542] px-5 py-2.5 text-sm font-medium text-[#F1F5F9] transition hover:bg-[#123058] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isGenerating ? "Generating..." : "Generate EGM XML"}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
