// Side drawer that shows a knowledge-base document in its original format (layout of #/pvPdf).
import { useEffect, useRef, useState, type ReactNode } from "react";
import { errorMessage, isAbort } from "../../services/api";
import { loadPdf } from "../../services/extractText";
import { formatBytes } from "../../services/limits";
import type { DocumentOriginal } from "../../services/types";
import { DOC_PILL } from "../chatbot/status";
import { Button, Spinner, StatusPill } from "../create/ui";
import { DemoDocxOriginal } from "./DemoDocxOriginal";
import { DemoPdfOriginal } from "./DemoPdfOriginal";
import { DemoXlsxOriginal } from "./DemoXlsxOriginal";

const BADGE: Record<string, { box: string; text: string }> = {
  PDF: { box: "bg-[#B3261E1F]", text: "text-[#B3261E]" },
  DOCX: { box: "bg-[#1F5FBF1F]", text: "text-[#1F5FBF]" },
  XLSX: { box: "bg-[#17653F1F]", text: "text-[#17653F]" },
};

const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { dateStyle: "medium" });

export function DocumentViewer({
  name,
  load,
  onClose,
}: {
  /** Shown while the document loads. */
  name: string;
  load: (signal: AbortSignal) => Promise<DocumentOriginal>;
  onClose: () => void;
}) {
  const [original, setOriginal] = useState<DocumentOriginal | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal)
      .then(setOriginal)
      .catch((e) => !isAbort(e) && setError(errorMessage(e)));
    return () => controller.abort();
    // `load` is recreated by the parent on every render; the document is chosen once per drawer.
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const doc = original?.document;
  const type = doc ? (doc.kind === "url" ? "URL" : doc.type) : (name.split(".").pop() ?? "").toUpperCase();
  const badge = BADGE[type] ?? { box: "bg-[#F3F3F1]", text: "text-[#525252]" };

  return (
    <div className="absolute inset-0 z-40">
      <div className="absolute inset-0 bg-[#1111114D] backdrop-blur-[4px]" onClick={onClose} />
      <div
        role="dialog"
        aria-label={name}
        className="absolute right-0 top-0 w-180 max-w-full h-full bg-[#FFFFFF] shadow-[-8px_0px_40px_0px_#0000001F] flex flex-col items-start"
      >
        <div className="self-stretch shrink-0 border-b border-[#E4E4E0] flex items-center gap-3 pt-6 pr-7 pb-5 pl-7">
          <div className={`w-10 h-10 shrink-0 rounded-[10px] flex justify-center items-center ${badge.box}`}>
            <div className={`font-geist-mono font-bold text-[10px] leading-normal ${badge.text}`}>{type || "DOC"}</div>
          </div>
          <div className="flex-1 min-w-0 flex flex-col items-start gap-1">
            <div className="max-w-full truncate font-gabarito font-bold text-[18px] leading-normal text-[#111111]">
              {doc?.name ?? name}
            </div>
            {original && doc && (
              <div className="flex items-center gap-2">
                <div className="font-gabarito text-[12px] leading-normal text-[#6B6B6B]">
                  {[
                    type,
                    doc.sizeBytes !== null && formatBytes(doc.sizeBytes),
                    note,
                    `uploaded ${formatDate(original.uploadedAt)}`,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </div>
                <StatusPill tone={DOC_PILL[doc.status].tone}>{DOC_PILL[doc.status].label}</StatusPill>
              </div>
            )}
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="w-10 h-10 shrink-0 rounded-full border border-border-default flex justify-center items-center text-[20px] leading-none text-ink-primary hover:bg-bg-soft cursor-pointer"
          >
            ×
          </button>
        </div>
        <div className="self-stretch shrink-0 bg-[#FAFAF9] flex justify-between items-center px-7 py-3">
          <div className="font-geist-mono font-bold text-[12px] leading-normal tracking-[0.01em] uppercase text-[#6B6B6B]">
            {"Original document"}
          </div>
        </div>
        <div className="self-stretch flex-1 min-h-0 overflow-auto flex flex-col">
          {error ? (
            <Centered>
              <div className="font-gabarito text-[14px] text-danger-text">{error}</div>
              <Button onClick={onClose}>Close</Button>
            </Centered>
          ) : !original ? (
            <Centered>
              <Spinner /> <span className="font-gabarito text-[14px] text-ink-secondary">Opening document…</span>
            </Centered>
          ) : (
            <OriginalBody original={original} onNote={setNote} />
          )}
        </div>
      </div>
    </div>
  );
}

function Centered({ children }: { children: ReactNode }) {
  return <div className="flex-1 flex flex-col justify-center items-center gap-3 p-10 text-center">{children}</div>;
}

function OriginalBody({ original, onNote }: { original: DocumentOriginal; onNote: (note: string) => void }) {
  if (original.demo === "pdf") return <DemoPdfOriginal />;
  if (original.demo === "docx") return <DemoDocxOriginal />;
  if (original.demo === "xlsx") return <DemoXlsxOriginal />;
  const { file, document } = original;
  if (file && document.type === "PDF") return <PdfPages file={file} onNote={onNote} />;
  if (file && document.type === "DOCX") return <DocxPage file={file} />;
  if (file && document.type === "XLSX") return <Workbook file={file} onNote={onNote} />;
  if (original.text.trim()) return <TextPage text={original.text} />;
  return (
    <Centered>
      <div className="font-gabarito text-[14px] text-ink-secondary">
        {document.kind === "url" ? `Web page: ${document.name}` : "The original file isn't available any more."}
      </div>
    </Centered>
  );
}

/** Grey canvas with white "paper", as in the Figma previews. */
function Paper({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1 bg-[#F0F0EE] flex flex-col items-center gap-6 px-12 py-7">
      <div className="w-140 max-w-full shrink-0 bg-[#FFFFFF] border border-[#E4E4E0] shadow-[0px_2px_8px_0px_#0000000F] p-12">
        {children}
      </div>
    </div>
  );
}

function TextPage({ text }: { text: string }) {
  return (
    <Paper>
      <pre className="whitespace-pre-wrap break-words font-gabarito text-[13px] leading-[20px] text-[#444444]">
        {text}
      </pre>
    </Paper>
  );
}

function PdfPages({ file, onNote }: { file: Blob; onNote: (note: string) => void }) {
  const host = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"loading" | "done" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const pdf = await loadPdf(file);
        onNote(`${pdf.numPages} page${pdf.numPages === 1 ? "" : "s"}`);
        for (let n = 1; n <= pdf.numPages && !cancelled; n++) {
          const page = await pdf.getPage(n);
          const viewport = page.getViewport({ scale: 1.4 });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.className =
            "w-140 max-w-full h-auto bg-white border border-[#E4E4E0] shadow-[0px_2px_8px_0px_#0000000F]";
          await page.render({ canvasContext: canvas.getContext("2d")!, viewport }).promise;
          if (!cancelled) host.current?.appendChild(canvas);
        }
        if (!cancelled) setState("done");
      } catch {
        if (!cancelled) setState("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [file, onNote]);

  return (
    <div className="flex-1 bg-[#F0F0EE] flex flex-col items-center gap-6 px-12 py-7">
      <div ref={host} className="contents" />
      {state === "loading" && (
        <div className="flex items-center gap-2 font-gabarito text-[13px] text-ink-secondary">
          <Spinner size={14} /> Rendering pages…
        </div>
      )}
      {state === "error" && (
        <div className="font-gabarito text-[13px] text-danger-text">This PDF couldn't be displayed.</div>
      )}
    </div>
  );
}

function DocxPage({ file }: { file: Blob }) {
  const [html, setHtml] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    import("mammoth")
      .then(async (mammoth) => (await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() })).value)
      .then((value) => !cancelled && setHtml(value))
      .catch(() => !cancelled && setHtml(""));
    return () => {
      cancelled = true;
    };
  }, [file]);
  if (html === null)
    return (
      <Centered>
        <Spinner />
      </Centered>
    );
  return (
    <Paper>
      {/* mammoth builds this HTML from the document's own paragraphs, headings, lists and tables. */}
      <div className="docx-original" dangerouslySetInnerHTML={{ __html: html || "<p>(This document is empty.)</p>" }} />
    </Paper>
  );
}

const columnName = (i: number) => {
  let name = "";
  for (let n = i + 1; n > 0; n = Math.floor((n - 1) / 26)) name = String.fromCharCode(65 + ((n - 1) % 26)) + name;
  return name;
};

function Workbook({ file, onNote }: { file: Blob; onNote: (note: string) => void }) {
  const [sheets, setSheets] = useState<{ name: string; rows: string[][] }[] | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let cancelled = false;
    import("xlsx")
      .then(async (XLSX) => {
        const book = XLSX.read(await file.arrayBuffer());
        return book.SheetNames.map((name) => ({
          name,
          rows: XLSX.utils.sheet_to_json<string[]>(book.Sheets[name], { header: 1, raw: false, defval: "" }),
        }));
      })
      .then((list) => {
        if (cancelled) return;
        setSheets(list);
        const rows = list.reduce((n, s) => n + s.rows.length, 0);
        onNote(`${list.length} sheet${list.length === 1 ? "" : "s"} · ${rows} rows`);
      })
      .catch(() => !cancelled && setSheets([]));
    return () => {
      cancelled = true;
    };
  }, [file, onNote]);

  if (!sheets)
    return (
      <Centered>
        <Spinner />
      </Centered>
    );
  if (!sheets.length)
    return (
      <Centered>
        <div className="font-gabarito text-[13px] text-danger-text">This spreadsheet couldn't be displayed.</div>
      </Centered>
    );
  const sheet = sheets[active];
  const width = Math.max(1, ...sheet.rows.map((r) => r.length));
  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="flex-1 min-h-0 overflow-auto">
        <table className="border-collapse font-gabarito text-[12px] text-[#111111]">
          <thead>
            <tr>
              <th className="sticky top-0 w-10 bg-[#F5F5F3] border border-[#E4E4E0]" />
              {Array.from({ length: width }, (_, c) => (
                <th
                  key={c}
                  className="sticky top-0 min-w-24 bg-[#F5F5F3] border border-[#E4E4E0] px-2 py-1 font-medium text-[#6B6B6B]"
                >
                  {columnName(c)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sheet.rows.map((row, r) => (
              <tr key={r}>
                <td className="bg-[#F5F5F3] border border-[#E4E4E0] px-2 py-1 text-center text-[#6B6B6B]">{r + 1}</td>
                {Array.from({ length: width }, (_, c) => (
                  <td
                    key={c}
                    className={`border border-[#ECECEA] px-2 py-1 whitespace-nowrap ${r === 0 ? "font-bold" : ""}`}
                  >
                    {row[c] ?? ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="shrink-0 border-t border-[#E4E4E0] bg-[#FAFAF9] flex items-center gap-1 px-3 py-1.5">
        {sheets.map((s, i) => (
          <button
            key={s.name}
            type="button"
            onClick={() => setActive(i)}
            className={`rounded-[6px] px-3 py-1 font-gabarito text-[12px] cursor-pointer ${
              i === active ? "bg-white border border-[#E4E4E0] font-bold text-[#111111]" : "text-[#6B6B6B]"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>
    </div>
  );
}
