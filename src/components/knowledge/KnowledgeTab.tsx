// Knowledge base tab of the chatbot detail page: add files and web pages to a chatbot that
// already exists, follow their processing, and open or remove each document (layout of #/kbDrop).
import { useEffect, useRef, useState } from "react";
import { api, errorMessage, isAbort } from "../../services/api";
import { FILE_ACCEPT, FILE_MAX_BYTES, SOURCES_MAX, fileTypeOf, formatBytes, normalizeUrl } from "../../services/limits";
import type { Chatbot, ChatbotDocument } from "../../services/types";
import { DOC_PILL } from "../chatbot/status";
import { ConfirmDialog } from "../create/ConfirmDialog";
import { Banner, Button, Spinner, StatusPill, TextArea } from "../create/ui";

type Pending =
  | {
      key: string;
      kind: "file";
      name: string;
      type: string;
      sizeBytes: number;
      progress: number;
      uploadId?: string;
      error?: string;
    }
  | { key: string; kind: "url"; name: string; url: string; checking: boolean; error?: string };

const newKey = () => Math.random().toString(36).slice(2, 10);

export function KnowledgeTab({
  bot,
  onChange,
  onView,
  onTest,
}: {
  bot: Chatbot;
  onChange: (bot: Chatbot) => void;
  onView: (doc: ChatbotDocument) => void;
  onTest: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const controllers = useRef(new Map<string, AbortController>());
  const [pending, setPending] = useState<Pending[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);
  const [urlText, setUrlText] = useState("");
  const [dragging, setDragging] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState<string[]>([]);
  const [removing, setRemoving] = useState<ChatbotDocument | null>(null);

  useEffect(() => () => controllers.current.forEach((c) => c.abort()), []);

  const patch = (key: string, change: Partial<Pending>) =>
    setPending((list) => list.map((p) => (p.key === key ? ({ ...p, ...change } as Pending) : p)));

  const room = SOURCES_MAX - bot.documents.length - pending.length;

  const addFiles = (files: File[]) => {
    const problems: string[] = [];
    let free = room;
    for (const file of files) {
      const type = fileTypeOf(file.name);
      if (!type) problems.push(`${file.name}: only PDF, DOCX, TXT, MD or XLSX files.`);
      else if (file.size > FILE_MAX_BYTES) problems.push(`${file.name}: larger than 20 MB.`);
      else if (free <= 0) problems.push(`${file.name}: a chatbot can have at most ${SOURCES_MAX} sources.`);
      else {
        free--;
        const key = newKey();
        const controller = new AbortController();
        controllers.current.set(key, controller);
        setPending((list) => [
          ...list,
          { key, kind: "file", name: file.name, type, sizeBytes: file.size, progress: 0 },
        ]);
        api
          .uploadFile(file, (progress) => patch(key, { progress }), controller.signal)
          .then((u) => patch(key, { uploadId: u.uploadId, progress: 1 }))
          .catch((e) => !isAbort(e) && patch(key, { error: errorMessage(e) }))
          .finally(() => controllers.current.delete(key));
      }
    }
    setRejected(problems);
  };

  const addUrls = () => {
    const problems: string[] = [];
    let free = room;
    for (const line of urlText
      .split(/[\n,]+/)
      .map((l) => l.trim())
      .filter(Boolean)) {
      const url = normalizeUrl(line);
      if (!url) problems.push(`${line}: not a valid link.`);
      else if (free <= 0) problems.push(`${line}: a chatbot can have at most ${SOURCES_MAX} sources.`);
      else {
        free--;
        const key = newKey();
        setPending((list) => [...list, { key, kind: "url", name: url, url, checking: true }]);
        api
          .previewUrl(url)
          .then((p) => patch(key, { checking: false, name: `${p.title} · ${p.host}` }))
          .catch((e) => patch(key, { checking: false, error: errorMessage(e) }));
      }
    }
    setRejected(problems);
    if (!problems.length) setUrlText("");
  };

  const discard = (item: Pending) => {
    controllers.current.get(item.key)?.abort();
    if (item.kind === "file" && item.uploadId) api.deleteUpload(item.uploadId).catch(() => undefined);
    setPending((list) => list.filter((p) => p.key !== item.key));
  };

  const busy = pending.some((p) => (p.kind === "file" ? !p.uploadId && !p.error : p.checking));
  const ok = pending.filter((p) => !p.error);

  const submit = async () => {
    setAdding(true);
    setError(null);
    try {
      const before = new Set(bot.documents.map((d) => d.id));
      const next = await api.addDocuments(bot.id, {
        uploadIds: ok.flatMap((p) => (p.kind === "file" && p.uploadId ? [p.uploadId] : [])),
        urls: ok.flatMap((p) => (p.kind === "url" ? [p.url] : [])),
      });
      setAdded(next.documents.filter((d) => !before.has(d.id)).map((d) => d.id));
      setPending((list) => list.filter((p) => p.error));
      onChange(next);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setAdding(false);
    }
  };

  const remove = async (doc: ChatbotDocument) => {
    setRemoving(null);
    setError(null);
    try {
      onChange(await api.removeDocument(bot.id, doc.id));
    } catch (e) {
      setError(errorMessage(e));
    }
  };

  const newDocs = bot.documents.filter((d) => added.includes(d.id));
  const newReady = newDocs.length > 0 && newDocs.every((d) => d.status === "ready");
  const ready = bot.documents.filter((d) => d.status === "ready").length;

  return (
    <div className="self-stretch flex flex-col items-start gap-6">
      {newDocs.length > 0 &&
        (newReady ? (
          <div className="self-stretch bg-success-tint border border-[#B7E2C8] rounded-[14px] flex items-center gap-3 px-4 py-3">
            <span className="flex-1 font-gabarito text-[14px] text-success-text">
              {`${newDocs.length === 1 ? `“${newDocs[0].name}” is` : `${newDocs.length} documents are`} ready. Ask the chatbot again — it can now answer from ${newDocs.length === 1 ? "it" : "them"}.`}
            </span>
            <Button variant="primary" onClick={onTest}>
              Test in Playground →
            </Button>
          </div>
        ) : (
          <Banner tone="info">
            {`Processing ${newDocs.length} new document${newDocs.length === 1 ? "" : "s"}. The chatbot starts using ${newDocs.length === 1 ? "it" : "them"} as soon as ${newDocs.length === 1 ? "it's" : "they're"} ready.`}
          </Banner>
        ))}

      <div className="self-stretch flex items-stretch gap-5">
        <div className="flex-1 min-w-0 bg-[#FFFFFF] border border-[#E4E4E0] rounded-[16px] flex flex-col items-start gap-4 p-7">
          <div className="flex flex-col items-start gap-1">
            <div className="font-gabarito font-bold text-[18px] leading-normal text-[#111111]">
              {"Upload documents"}
            </div>
            <div className="font-gabarito text-[13px] leading-normal text-[#6B6B6B]">
              {"PDF, DOCX, TXT, MD, XLSX · up to 20 MB per file"}
            </div>
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              addFiles([...e.dataTransfer.files]);
            }}
            className={`self-stretch rounded-[14px] border-[2px] border-dashed flex flex-col items-center gap-2.5 px-6 py-7 cursor-pointer ${
              dragging ? "bg-[#5B3FC40F] border-[#5B3FC4]" : "bg-[#FAFAF9] border-[#D6D6D2] hover:border-[#5B3FC4]"
            }`}
          >
            <img className="w-12 h-12 shrink-0" src="icons/frame-11.svg" alt="" />
            <span className="font-gabarito font-medium text-[14px] leading-normal text-[#5B3FC4]">
              {dragging ? "Drop to upload" : "Drag files here or click to browse"}
            </span>
            <span className="font-gabarito text-[12px] leading-normal text-[#8A8A86]">{`${Math.max(room, 0)} of ${SOURCES_MAX} sources left`}</span>
          </button>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={FILE_ACCEPT}
            className="hidden"
            onChange={(e) => {
              addFiles([...(e.target.files ?? [])]);
              e.target.value = "";
            }}
          />
        </div>
        <div className="flex-1 min-w-0 bg-[#FFFFFF] border border-[#E4E4E0] rounded-[16px] flex flex-col items-start gap-4 p-7">
          <div className="flex flex-col items-start gap-1">
            <div className="font-gabarito font-bold text-[18px] leading-normal text-[#111111]">
              {"Import web pages"}
            </div>
            <div className="font-gabarito text-[13px] leading-normal text-[#6B6B6B]">
              {"One link per line, or separated by commas"}
            </div>
          </div>
          <TextArea
            aria-label="Web page links"
            rows={4}
            value={urlText}
            placeholder="https://help.example.com/student-discounts"
            onChange={(e) => setUrlText(e.target.value)}
          />
          <Button disabled={!urlText.trim()} onClick={addUrls}>
            Add links
          </Button>
        </div>
      </div>

      {rejected.length > 0 && (
        <Banner tone="warning" onDismiss={() => setRejected([])}>
          {rejected.join(" ")}
        </Banner>
      )}

      {pending.length > 0 && (
        <div className="self-stretch bg-[#FFFFFF] border border-[#E4E4E0] rounded-[16px] flex flex-col items-start gap-3 p-5">
          <div className="font-gabarito font-bold text-[16px] text-[#111111]">{`Ready to add (${ok.length})`}</div>
          <div className="self-stretch border border-[#ECECEA] rounded-[12px] overflow-hidden flex flex-col">
            {pending.map((p) => (
              <div
                key={p.key}
                className="border-b border-[#F0F0EE] last:border-b-0 flex items-center gap-3 px-4 py-2.5"
              >
                <div className="w-11 h-6 shrink-0 bg-[#F3F3F1] rounded-[6px] flex justify-center items-center font-geist-mono text-[10px] text-[#525252]">
                  {p.kind === "url" ? "URL" : p.type}
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <div className="truncate font-gabarito font-medium text-[14px] text-ink-primary">{p.name}</div>
                  {p.error ? (
                    <div className="font-gabarito text-[12px] text-danger-text">{p.error}</div>
                  ) : p.kind === "file" && !p.uploadId ? (
                    <div className="w-60 h-1 bg-[#F0F0EE] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#5B3FC4] transition-[width]"
                        style={{ width: `${p.progress * 100}%` }}
                      />
                    </div>
                  ) : p.kind === "url" && p.checking ? (
                    <div className="font-gabarito text-[12px] text-ink-secondary">Checking the page…</div>
                  ) : (
                    <div className="font-gabarito text-[12px] text-ink-secondary">
                      {p.kind === "file" ? `Uploaded · ${formatBytes(p.sizeBytes)}` : "Page reachable"}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => discard(p)}
                  className="shrink-0 font-gabarito font-medium text-[13px] text-ink-secondary hover:text-danger-text cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="primary" loading={adding} disabled={busy || !ok.length} onClick={submit}>
              {`Add ${ok.length} to knowledge base`}
            </Button>
            {busy && (
              <span className="font-gabarito text-[13px] text-ink-secondary">Waiting for uploads to finish…</span>
            )}
          </div>
        </div>
      )}

      {error && (
        <Banner tone="danger" onDismiss={() => setError(null)}>
          {error}
        </Banner>
      )}

      <div className="self-stretch bg-bg-card border border-border-default rounded-[20px] flex flex-col items-start gap-3 p-5">
        <div className="font-gabarito font-bold text-[18px] leading-[28px] text-ink-primary">
          {`Documents · ${ready} of ${bot.documents.length} ready`}
        </div>
        <DocumentRows documents={bot.documents} onView={onView} onRemove={setRemoving} />
      </div>

      <ConfirmDialog
        open={!!removing}
        title={`Remove “${removing?.name ?? ""}”?`}
        confirmLabel="Remove document"
        cancelLabel="Cancel"
        danger
        onCancel={() => setRemoving(null)}
        onConfirm={() => removing && remove(removing)}
      >
        The chatbot stops using this document right away. Questions it answered from it may go unanswered.
      </ConfirmDialog>
    </div>
  );
}

/** Document list shared by the Overview and Knowledge base tabs. */
export function DocumentRows({
  documents,
  onView,
  onRemove,
}: {
  documents: ChatbotDocument[];
  onView: (doc: ChatbotDocument) => void;
  onRemove?: (doc: ChatbotDocument) => void;
}) {
  if (!documents.length) return <div className="font-gabarito text-[14px] text-ink-secondary">No documents yet.</div>;
  return (
    <div className="self-stretch border border-[#ECECEA] rounded-[16px] overflow-hidden flex flex-col">
      {documents.map((d) => (
        <div
          key={d.id}
          className="border-b border-[#F0F0EE] last:border-b-0 flex items-center gap-3 px-4 py-3 hover:bg-bg-page"
        >
          <div className="w-11 h-6 shrink-0 bg-[#F3F3F1] rounded-[6px] flex justify-center items-center font-geist-mono text-[10px] text-[#525252]">
            {d.kind === "url" ? "URL" : d.type}
          </div>
          <button
            type="button"
            onClick={() => onView(d)}
            className="flex-1 min-w-0 text-left truncate font-gabarito font-medium text-[14px] leading-[20px] text-ink-primary hover:underline cursor-pointer"
          >
            {d.name}
          </button>
          <div className="w-18 shrink-0 font-gabarito text-[12px] text-ink-secondary">{formatBytes(d.sizeBytes)}</div>
          <div className="w-24 shrink-0 flex justify-end">
            <StatusPill tone={DOC_PILL[d.status].tone} pulse={d.status === "processing"}>
              {DOC_PILL[d.status].label}
            </StatusPill>
          </div>
          <button
            type="button"
            onClick={() => onView(d)}
            className="shrink-0 font-gabarito font-medium text-[13px] text-ink-primary hover:underline cursor-pointer"
          >
            View
          </button>
          {/* Fixed-width slot so rows without Remove (demo documents) keep the columns aligned. */}
          {onRemove && (
            <div className="w-14 shrink-0 flex justify-end">
              {!d.id.startsWith("doc_demo_") && (
                <button
                  type="button"
                  onClick={() => onRemove(d)}
                  className="font-gabarito font-medium text-[13px] text-ink-secondary hover:text-danger-text cursor-pointer"
                >
                  Remove
                </button>
              )}
            </div>
          )}
          <div className="w-3 shrink-0 flex justify-center">{d.status === "processing" && <Spinner size={12} />}</div>
        </div>
      ))}
    </div>
  );
}
