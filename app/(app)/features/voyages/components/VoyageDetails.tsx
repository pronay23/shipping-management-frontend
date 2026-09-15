"use client";

import React, { useState } from "react";
import { downloadIgmXml, downloadEgmXml } from "../../manifest/api/generateManifestXml";

interface VoyageDetailsProps {
  voyageId: string | number;
  vesselName?: string;
  voyageNumber?: string;
}

export function VoyageDetails({ voyageId, vesselName, voyageNumber }: VoyageDetailsProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadIgm = async () => {
    setIsGenerating(true);
    try {
      await downloadIgmXml(voyageId);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadEgm = async () => {
    setIsGenerating(true);
    try {
      await downloadEgmXml(voyageId);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Voyage {voyageNumber && `- ${voyageNumber}`}
          </h2>
          {vesselName && <p className="text-sm text-gray-500">Vessel: {vesselName}</p>}
        </div>
        <div className="space-x-3 flex">
          <button
            onClick={handleDownloadIgm}
            disabled={isGenerating}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            {isGenerating ? "Generating..." : "Generate IGM XML"}
          </button>
          
          <button
            onClick={handleDownloadEgm}
            disabled={isGenerating}
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            {isGenerating ? "Generating..." : "Generate EGM XML"}
          </button>
        </div>
      </div>
    </div>
  );
}
