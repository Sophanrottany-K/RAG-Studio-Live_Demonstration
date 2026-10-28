// The demo HR Assistant's knowledge base. Unlike the Billing Assistant's Figma previews, these are
// real files (sample-documents/hr-assistant/, packed into hrSeedFiles.ts): the mock reads their text
// with extractText() the first time they are needed, so answers quote exactly what the viewer shows.
// Nothing here covers training or courses: "Is there a training budget for courses?" is answered
// only after "Learning and development policy.pdf" (in sample-documents/) is added.

export type SeedDocument = {
  id: string;
  name: string;
  type: string;
  sizeBytes: number;
  uploadedAt: string;
};

export const HR_DOCUMENTS: SeedDocument[] = [
  {
    id: "doc_demo_hr_handbook",
    name: "Employee handbook 2026.pdf",
    type: "PDF",
    sizeBytes: 2090,
    uploadedAt: "2026-10-20T09:00:00.000Z",
  },
  {
    id: "doc_demo_hr_leave",
    name: "Leave policy.docx",
    type: "DOCX",
    sizeBytes: 2193,
    uploadedAt: "2026-10-20T09:00:00.000Z",
  },
  {
    id: "doc_demo_hr_benefits",
    name: "Benefits overview.xlsx",
    type: "XLSX",
    sizeBytes: 19085,
    uploadedAt: "2026-10-20T09:00:00.000Z",
  },
  {
    id: "doc_demo_hr_remote",
    name: "Remote work policy.md",
    type: "MD",
    sizeBytes: 630,
    uploadedAt: "2026-10-20T09:00:00.000Z",
  },
];

/** Loads a seed document's original file (the file bodies are a separate, lazily loaded chunk). */
export async function loadSeedFile(doc: SeedDocument): Promise<Blob> {
  const { HR_SEED_FILES } = await import("./hrSeedFiles");
  const data = HR_SEED_FILES[doc.name];
  if (!data) throw new Error(`Missing seed file ${doc.name}`);
  return new Blob([Uint8Array.from(atob(data), (c) => c.charCodeAt(0))]);
}
