// The demo Property Assistant's knowledge base: real files in sample-documents/property-assistant/, packed
// into propertySeedFiles.ts. Being built in, this chatbot also works in the web widget on another website,
// where the widget can't see chatbots created in this browser's storage.
import type { SeedDocument } from "./hrDocuments";

export const PROPERTY_DOCUMENTS: SeedDocument[] = [
  {
    id: "doc_demo_property_listings",
    name: "Property listings.md",
    type: "MD",
    sizeBytes: 3740,
    uploadedAt: "2026-10-24T09:00:00.000Z",
  },
  {
    id: "doc_demo_property_guide",
    name: "Home buying guide.md",
    type: "MD",
    sizeBytes: 1151,
    uploadedAt: "2026-10-24T09:00:00.000Z",
  },
  {
    id: "doc_demo_property_faq",
    name: "Agency FAQ.md",
    type: "MD",
    sizeBytes: 1009,
    uploadedAt: "2026-10-24T09:00:00.000Z",
  },
];

/** Loads a seed document's original file (the file bodies are a separate, lazily loaded chunk). */
export async function loadPropertySeedFile(doc: SeedDocument): Promise<Blob> {
  const { PROPERTY_SEED_FILES } = await import("./propertySeedFiles");
  const data = PROPERTY_SEED_FILES[doc.name];
  if (!data) throw new Error(`Missing seed file ${doc.name}`);
  return new Blob([Uint8Array.from(atob(data), (c) => c.charCodeAt(0))]);
}
