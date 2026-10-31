// Pulls plain text out of an uploaded file, the way the server's ingestion step would before
// chunking and embedding. Each parser is loaded only when a file of that type arrives.

/**
 * Bump when extractText's output changes: text stored by an older version is read again from the
 * stored file (see `documentText` in mockServer.ts), so earlier uploads benefit too.
 */
export const TEXT_VERSION = 2;

const cellText = (cell: Element) => (cell.textContent ?? "").replace(/\s+/g, " ").trim();

/** Ends a line with a full stop, unless it already ends with punctuation. */
const sentence = (text: string) => (/[.!?:;]$/.test(text) ? text : `${text}.`);

/**
 * Word document → paragraphs separated by blank lines. Table rows become one line each, so a row
 * "Eligibility stated | IT students in Year 2…" reads "Eligibility stated: IT students in Year 2…".
 */
function docxHtmlToText(html: string) {
  const body = new DOMParser().parseFromString(html, "text/html").body;
  const blocks: string[] = [];
  for (const el of Array.from(body.children)) {
    if (el.tagName === "TABLE") {
      for (const row of Array.from(el.querySelectorAll("tr"))) {
        const cells = Array.from(row.querySelectorAll("th,td")).map(cellText).filter(Boolean);
        if (cells.length) blocks.push(sentence(cells.length === 2 ? `${cells[0]}: ${cells[1]}` : cells.join(" | ")));
      }
    } else if (el.tagName === "UL" || el.tagName === "OL") {
      blocks.push(
        Array.from(el.querySelectorAll("li"))
          .map((li) => sentence(cellText(li)))
          .join("\n"),
      );
    } else {
      const text = cellText(el);
      if (text) blocks.push(text);
    }
  }
  return blocks.join("\n\n");
}

/**
 * Spreadsheet → one line per row, each value labelled with its column header
 * ("Category: Eligibility; Task / Item: IT student in Year 2…"). Rows above the header row (titles) stay as they are.
 */
function sheetRowsToText(rows: unknown[][]) {
  const clean = rows.map((r) =>
    r.map((c) =>
      String(c ?? "")
        .replace(/\s+/g, " ")
        .trim(),
    ),
  );
  const headerAt = clean.findIndex((r) => r.filter(Boolean).length >= 2);
  if (headerAt < 0)
    return clean
      .map((r) => r.filter(Boolean).join(" "))
      .filter(Boolean)
      .join("\n\n");
  const header = clean[headerAt];
  const lines = clean.slice(0, headerAt).map((r) => r.filter(Boolean).join(" "));
  for (const row of clean.slice(headerAt + 1)) {
    const parts = row.map((value, i) => (value ? (header[i] ? `${header[i]}: ${value}` : value) : "")).filter(Boolean);
    if (parts.length) lines.push(sentence(parts.join("; ")));
  }
  return lines.filter(Boolean).join("\n\n");
}

export async function extractText(file: Blob, type: string): Promise<string> {
  switch (type) {
    case "TXT":
    case "MD":
      return file.text();
    case "DOCX": {
      const mammoth = await import("mammoth");
      const { value } = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() });
      return docxHtmlToText(value);
    }
    case "XLSX": {
      const XLSX = await import("xlsx");
      const book = XLSX.read(await file.arrayBuffer());
      return book.SheetNames.map((name) => {
        const rows = XLSX.utils.sheet_to_json<unknown[]>(book.Sheets[name], { header: 1, blankrows: false });
        return `${name}\n\n${sheetRowsToText(rows)}`;
      }).join("\n\n");
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
