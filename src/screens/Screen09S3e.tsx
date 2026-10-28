// Create chatbot · Step 3 · Knowledge base
// Routes: #/s3e, #/s3u, #/s3f, #/s3l
import { useRef, useState, type ReactNode } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ConfirmDialog } from "../components/create/ConfirmDialog";
import { CreateLayout, StepFooter, StepHeading } from "../components/create/CreateLayout";
import { DraftPreview, PublishChecklist } from "../components/create/DraftPreview";
import { Banner, Button, Field, StatusPill, TextArea } from "../components/create/ui";
import { useCancelCreate } from "../components/create/useCancelCreate";
import { sourceCounts, useChatbotDraft, type DraftSource } from "../lib/chatbotDraft";
import { api, errorMessage } from "../services/api";
import { FILE_ACCEPT, SOURCES_MAX, URLS_PER_IMPORT_MAX, formatBytes } from "../services/limits";
import { ApiError } from "../services/types";

export default function Screen09S3e() {
  const navigate = useNavigate();
  const { draft, addFiles, addUrls, toRequest, reset } = useChatbotDraft();
  const { requestCancel, dialog } = useCancelCreate();
  const fileInput = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [rejected, setRejected] = useState<string[]>([]);
  const [urlText, setUrlText] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<ReactNode>(null);
  const [confirmSkip, setConfirmSkip] = useState(false);

  if (draft.reachedStep < 3) return <Navigate to={draft.reachedStep === 2 ? "/s2" : "/s1e"} replace />;

  const counts = sourceCounts(draft.sources);
  const full = counts.total >= SOURCES_MAX;

  const takeFiles = (list: FileList | null) => {
    if (!list?.length) return;
    setRejected(addFiles(Array.from(list)));
  };

  const importUrls = () => {
    const lines = urlText
      .split(/[\n,]+/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (!lines.length) return setUrlError("Paste at least one link.");
    if (lines.length > URLS_PER_IMPORT_MAX)
      return setUrlError(`Import at most ${URLS_PER_IMPORT_MAX} links at a time.`);
    const errors = addUrls(lines);
    setUrlError(errors.length ? errors.join(" ") : null);
    // Keep only the lines that were rejected, so the user can fix them.
    setUrlText(lines.filter((l) => errors.some((e) => e.startsWith(`${l}:`))).join("\n"));
  };

  const create = async (withSources: boolean) => {
    setCreating(true);
    setCreateError(null);
    try {
      const request = toRequest();
      const bot = await api.createChatbot(withSources ? request : { ...request, uploadIds: [], urls: [] });
      reset(!withSources);
      navigate(`/created?id=${bot.id}`);
    } catch (e) {
      setCreating(false);
      if (e instanceof ApiError && e.field === "name") {
        setCreateError(
          <>
            {`${e.message} `}
            <button type="button" className="underline font-medium cursor-pointer" onClick={() => navigate("/s1e")}>
              Change the name
            </button>
          </>,
        );
      } else {
        setCreateError(errorMessage(e));
      }
    }
  };

  const skip = () => (counts.total ? setConfirmSkip(true) : create(false));

  return (
    <CreateLayout
      step={3}
      overlay={
        <>
          {dialog}
          <ConfirmDialog
            open={confirmSkip}
            title="Create without documents?"
            confirmLabel="Create without documents"
            onConfirm={() => {
              setConfirmSkip(false);
              create(false);
            }}
            onCancel={() => setConfirmSkip(false)}
          >
            {`The ${counts.total} source${counts.total === 1 ? "" : "s"} you added will be discarded. You can add documents later from the chatbot's Knowledge base tab.`}
          </ConfirmDialog>
        </>
      }
      aside={
        <>
          <DraftPreview step={3} />
          <PublishChecklist />
        </>
      }
    >
      <StepHeading
        title="Knowledge base"
        subtitle="Upload documents or import URLs your chatbot will answer from. You can skip this step and add them later — at least 1 document is needed to publish."
      />

      <div
        role="button"
        tabIndex={0}
        aria-disabled={full}
        onClick={() => !full && fileInput.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && !full && fileInput.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (!full) takeFiles(e.dataTransfer.files);
        }}
        className={`self-stretch shrink-0 border-2 border-dashed rounded-[28px] flex flex-col items-center gap-4 px-8 py-12 transition-colors outline-none focus-visible:border-ink-primary ${
          full
            ? "opacity-50 cursor-not-allowed border-border-dashed"
            : dragOver
              ? "bg-bg-subtle border-ink-primary cursor-copy"
              : "bg-bg-card border-border-dashed cursor-pointer hover:bg-bg-page"
        }`}
      >
        <input
          ref={fileInput}
          type="file"
          multiple
          accept={FILE_ACCEPT}
          className="hidden"
          onChange={(e) => (takeFiles(e.target.files), (e.target.value = ""))}
        />
        <img className="w-16 h-16 shrink-0" src="icons/icon-tile-4.svg" alt="" />
        <div className="font-gabarito font-bold text-[24px] leading-[28px] text-ink-primary">
          {dragOver ? "Drop to upload" : "Drag and drop files here"}
        </div>
        <div className="text-center font-gabarito text-[16px] leading-[24px] text-ink-secondary">
          {full ? (
            `You've reached ${SOURCES_MAX} sources.`
          ) : (
            <>
              PDF, DOCX, TXT, MD or XLSX · up to 20 MB each · or{" "}
              <span className="underline text-ink-primary">browse files</span>
            </>
          )}
        </div>
      </div>
      {rejected.length > 0 && (
        <Banner tone="danger" onDismiss={() => setRejected([])}>
          <div className="font-medium">{`${rejected.length} file${rejected.length === 1 ? " wasn't" : "s weren't"} added`}</div>
          {rejected.map((r) => (
            <div key={r}>{r}</div>
          ))}
        </Banner>
      )}

      <Field
        label="Import from URLs"
        htmlFor="urls"
        error={urlError}
        hint={`Paste 1–${URLS_PER_IMPORT_MAX} public links, one per line. Each link is imported as one page.`}
      >
        <TextArea
          id="urls"
          rows={3}
          value={urlText}
          disabled={full}
          invalid={!!urlError}
          placeholder={"https://help.example.com/billing/refunds\nhttps://help.example.com/payment-methods"}
          onChange={(e) => {
            setUrlText(e.target.value);
            setUrlError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) importUrls();
          }}
        />
      </Field>
      <div className="self-stretch -mt-3 flex justify-end">
        <Button icon="icons/icon-plus-2.svg" disabled={!urlText.trim() || full} onClick={importUrls}>
          Import URLs
        </Button>
      </div>

      {counts.total > 0 && (
        <div className="self-stretch flex flex-col gap-3">
          <div className="self-stretch flex justify-between items-center">
            <div className="font-gabarito font-medium text-[12px] leading-[16px] text-ink-primary">{`Added sources (${counts.total})`}</div>
            <div className="font-gabarito text-[12px] leading-[16px] text-ink-secondary">
              {[
                counts.ready && `${counts.ready} uploaded`,
                counts.busy && `${counts.busy} in progress`,
                counts.failed && `${counts.failed} failed`,
              ]
                .filter(Boolean)
                .join(" · ")}
            </div>
          </div>
          <div className="self-stretch bg-bg-card border border-border-default rounded-[16px] overflow-hidden flex flex-col">
            <div className="self-stretch bg-bg-page border-b border-[#ECECEA] flex items-center gap-4 px-4 py-2 font-gabarito font-medium text-[10px] leading-[14px] tracking-[0.6px] text-ink-muted">
              <div className="flex-1 min-w-0">NAME</div>
              <div className="w-21 shrink-0">TYPE</div>
              <div className="w-21 shrink-0">SIZE</div>
              <div className="w-28 shrink-0">STATUS</div>
              <div className="w-18 shrink-0" />
            </div>
            {draft.sources.map((s) => (
              <SourceRow key={s.localId} source={s} />
            ))}
          </div>
          <div className="font-gabarito text-[12px] leading-[16px] text-ink-secondary">
            Uploaded sources are indexed after you create the chatbot. Processing continues in the background.
          </div>
        </div>
      )}

      {createError && (
        <Banner tone="danger" onDismiss={() => setCreateError(null)}>
          {createError}
        </Banner>
      )}
      <StepFooter>
        <Button icon="icons/arrow-left-property-linear-2.svg" disabled={creating} onClick={() => navigate("/s2")}>
          Back
        </Button>
        <Button variant="ghost" disabled={creating} onClick={requestCancel}>
          Cancel
        </Button>
        <div className="flex-1 text-right font-gabarito text-[12px] leading-[16px] text-ink-secondary">
          {counts.busy > 0
            ? "Wait for uploads to finish…"
            : counts.failed > 0 && counts.ready > 0
              ? `${counts.failed} failed source${counts.failed === 1 ? "" : "s"} won't be added`
              : ""}
        </div>
        <Button variant="ghost" disabled={creating} onClick={skip}>
          Skip for now
        </Button>
        <Button
          variant="primary"
          loading={creating}
          disabled={counts.busy > 0 || counts.ready === 0}
          onClick={() => create(true)}
        >
          {creating ? "Creating…" : "Create chatbot"}
        </Button>
      </StepFooter>
    </CreateLayout>
  );
}

function SourceRow({ source }: { source: DraftSource }) {
  const { retrySource, canRetry, removeSource } = useChatbotDraft();
  const badge = source.kind === "url" ? "URL" : source.type;
  return (
    <div className="self-stretch border-b border-[#ECECEA] last:border-b-0 flex items-center gap-4 px-4 py-3">
      <div className="flex-1 min-w-0 flex items-center gap-2.5">
        <div className="w-11 h-6 shrink-0 bg-[#F3F3F1] rounded-[6px] flex justify-center items-center font-geist-mono text-[10px] leading-[16px] tracking-[0.4px] text-[#525252]">
          {badge}
        </div>
        <div className="min-w-0 flex-1 flex flex-col gap-1">
          <div
            className="truncate font-gabarito font-medium text-[14px] leading-[20px] text-ink-primary"
            title={source.url ?? source.name}
          >
            {source.name}
          </div>
          {source.state === "uploading" && source.kind === "file" && (
            <div className="w-full max-w-60 h-1 bg-bg-subtle rounded-full overflow-hidden">
              <div
                className="h-full bg-ink-primary rounded-full transition-[width] duration-150"
                style={{ width: `${Math.round(source.progress * 100)}%` }}
              />
            </div>
          )}
          {source.state === "failed" && (
            <div className="font-gabarito text-[12px] leading-[16px] text-danger-text">{source.error}</div>
          )}
        </div>
      </div>
      <div className="w-21 shrink-0 font-gabarito text-[12px] leading-[16px] text-ink-secondary">
        {source.kind === "url" ? "Web page" : source.type}
      </div>
      <div className="w-21 shrink-0 font-gabarito text-[12px] leading-[16px] text-ink-secondary">
        {formatBytes(source.sizeBytes)}
      </div>
      <div className="w-28 shrink-0">
        {source.state === "uploading" ? (
          <StatusPill tone="warning" pulse>
            {source.kind === "url" ? "Checking" : `Uploading ${Math.round(source.progress * 100)}%`}
          </StatusPill>
        ) : source.state === "failed" ? (
          <StatusPill tone="danger">Failed</StatusPill>
        ) : (
          <StatusPill tone="success">{source.kind === "url" ? "Reachable" : "Uploaded"}</StatusPill>
        )}
      </div>
      <div className="w-18 shrink-0 flex justify-end items-center gap-1">
        {source.state === "failed" && canRetry(source.localId) && (
          <button
            type="button"
            className="font-gabarito font-medium text-[12px] underline text-ink-primary cursor-pointer"
            onClick={() => retrySource(source.localId)}
          >
            Retry
          </button>
        )}
        <button
          type="button"
          aria-label={source.state === "uploading" ? `Cancel ${source.name}` : `Remove ${source.name}`}
          title={source.state === "uploading" ? "Cancel" : "Remove"}
          className="w-8 h-8 shrink-0 cursor-pointer hover:opacity-70"
          onClick={() => removeSource(source.localId)}
        >
          <img className="w-8 h-8" src="icons/button-icon-close.svg" alt="" />
        </button>
      </div>
    </div>
  );
}
