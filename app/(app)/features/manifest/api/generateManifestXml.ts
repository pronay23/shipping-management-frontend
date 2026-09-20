import { apiGet } from "../../../../lib/api-client";

export async function downloadIgmXml(voyageId: string | number, token?: string) {
  const url = `/voyages/${voyageId}/xml/igm`;
  await downloadFile(url, `IGM_Voyage_${voyageId}.xml`, token);
}

export async function downloadEgmXml(voyageId: string | number, token?: string) {
  const url = `/voyages/${voyageId}/xml/egm`;
  await downloadFile(url, `EGM_Voyage_${voyageId}.xml`, token);
}

async function downloadFile(url: string, defaultFilename: string, token?: string) {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/xml",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
