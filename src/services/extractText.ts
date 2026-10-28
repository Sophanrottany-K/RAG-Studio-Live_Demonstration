// Pulls plain text out of an uploaded file, the way the server's ingestion step would before
// chunking and embedding. Each parser is loaded only when a file of that type arrives.

export async function extractText(file: Blob, type: string): Promise<string> {
  switch (type) {
    case "TXT":
    case "MD":
      return file.text();
    case "DOCX": {
      const mammoth = await import("mammoth");
      const { value } = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
      return value;
    }
    case "XLSX": {
      const XLSX = await import("xlsx");
      const book = XLSX.read(await file.arrayBuffer());
      return book.SheetNames.map(
        (name) => `${name}\n${XLSX.utils.sheet_to_csv(book.Sheets[name], { blankrows: false })}`,
      ).join("\n\n");
    }
    case "PDF": {
      const pdf = await loadPdf(file);
      const pages: string[] = [];
      for (let n = 1; n <= pdf.numPages; n++) {
        const content = await (await pdf.getPage(n)).getTextContent();
        // Keep the PDF's own line breaks so paragraphs survive.
        pages.push(content.items.map((item) => ("str" in item ? item.str + (item.hasEOL ? "\n" : "") : "")).join(""));
      }
      return pages.join("\n\n");
    }
    default:
      return "";
  }
}

export async function loadPdf(file: Blob) {
  const pdfjs = await import("pdfjs-dist");
  const { default: workerSrc } = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
  pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
  return pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
}
