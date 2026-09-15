const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000/api";

export async function downloadIgmXml(voyageId: string | number) {
  const url = `${API_BASE_URL}/voyages/${voyageId}/xml/igm`;
  await downloadFile(url, `IGM_Voyage_${voyageId}.xml`);
}

export async function downloadEgmXml(voyageId: string | number) {
  const url = `${API_BASE_URL}/voyages/${voyageId}/xml/egm`;
  await downloadFile(url, `EGM_Voyage_${voyageId}.xml`);
}

async function downloadFile(url: string, defaultFilename: string) {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/xml"
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to download XML: ${response.statusText}`);
    }

    const blob = await response.blob();
    const contentDisposition = response.headers.get("Content-Disposition");
    let filename = defaultFilename;
    if (contentDisposition && contentDisposition.includes("filename=")) {
      const matches = /filename="([^"]+)"/.exec(contentDisposition);
      if (matches && matches[1]) {
        filename = matches[1];
      }
    }

    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Download error:", error);
    alert("Failed to download XML. Please check console for details.");
  }
}
