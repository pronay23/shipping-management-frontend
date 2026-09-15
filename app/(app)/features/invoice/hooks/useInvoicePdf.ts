"use client";

import { useRef, useState } from "react";

export function useInvoicePdf() {
  const previewRef = useRef<HTMLDivElement | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  async function generatePdf(filename: string) {
    const element = previewRef.current;
    if (!element || isGenerating) return;
    setIsGenerating(true);

    try {
      const domtoimage = (await import("dom-to-image-more")).default;
      const jsPDFModule = await import("jspdf");
      const jsPDF = jsPDFModule?.jsPDF ?? jsPDFModule?.default ?? jsPDFModule;
      if (!domtoimage || !jsPDF) throw new Error("PDF library load failed");

      const scale = 2;
      const width = element.scrollWidth;
      const height = element.scrollHeight;

      const dataUrl = await domtoimage.toPng(element, {
        width: width * scale,
        height: height * scale,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: `${width}px`,
          height: `${height}px`,
        },
      });

      const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(filename);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("Invoice PDF generation failed:", error);
      alert(`Unable to generate PDF: ${message}`);
    } finally {
      setIsGenerating(false);
    }
  }

  return { previewRef, isGenerating, generatePdf };
}
