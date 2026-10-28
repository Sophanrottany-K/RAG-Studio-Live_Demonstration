# RAG Studio · Live Demo (static UI)

Static React build of the Figma section **Live Demo · RAG Studio (prototype)**: 44 screens, linked exactly like the Figma prototype.

## Run it

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173). The first screen is Demo 01; click through the UI to follow the flow.
Open `#/screens` to jump to any screen.

## Build a static site

```bash
npm run build
```

Upload the `dist/` folder to any static host (Netlify, Vercel, GitHub Pages, S3...). Routes use `#/...`, so no server config is needed.

## Create chatbot flow and the backend

The Create chatbot wizard (`#/s1e` → `#/s2` → `#/s3e` → `#/created`) is fully interactive: real inputs,
validation, file uploads with progress, URL checks, and documents that process in the background.

It talks to the backend through `src/services/api.ts`. With no configuration, an in-browser mock server
(`src/services/mockServer.ts`) answers every call with realistic latency and errors, and stores data in
localStorage. To use a real backend, create `.env.local` with:

```
VITE_API_URL=https://your-api.example.com/v1
```

The endpoint contract is listed at the top of `src/services/api.ts`; request/response types are in
`src/services/types.ts` and shared limits (file types, sizes, name length) in `src/services/limits.ts`.

The rest of the chatbot lifecycle runs on the same API:

- `#/bot?id=…`: the chatbot detail page. It handles Publish (once every document is ready), Pause and
  Resume, shows the documents and which channels are connected, and has a working **Manage** link.
  The old static detail routes (`#/dPend`, `#/active2`, `#/paused`, …) open it for the demo chatbot.
- `#/ch0?bot=…`: Channels. Set up the public link, the web widget and the Telegram bot.
- `#/pg?bot=…`: Playground. Ask any question. It answers from the chatbot's ready documents (see
  **Knowledge and answers** below).
- `#/s/<token>`: the guest page behind a public link. It opens in a new tab and works like the
  Playground. It shows "temporarily unavailable" while the chatbot is paused, and "no longer active"
  when the link is disabled or expired.

The mock always contains two published demo chatbots: "Billing Assistant" (`demo_billing`) and
"HR Assistant" (`demo_hr`). **Chatbots** in the sidebar, page header and breadcrumbs opens the chatbot
list (`#/list`), which shows every chatbot.

**Knowledge and answers.** The detail page's **Knowledge base** tab adds files and web pages to an existing
chatbot. When a file is uploaded, the mock keeps the original and reads its text, the way the server's
ingestion step would:

- PDF is read with `pdfjs-dist`, DOCX with `mammoth`, and XLSX with SheetJS (`xlsx`).
- The file and its text are stored in IndexedDB (`rag-studio-files`).

Answers come from a small keyword retriever. If a ready document contains a matching passage, the chatbot
quotes it and cites the source. Otherwise it says the question is outside its knowledge. For example:

1. In the Playground, ask "Do you offer student discounts?". The chatbot says it doesn't know.
2. Upload a student-discount document in the Knowledge base tab.
3. Once the document is ready, ask the same question again. The chatbot answers from the new document.

Every document, and every source under an answer, opens in its original format in a side drawer. The Billing
Assistant's documents use the Figma previews (`#/pvPdf`, `#/pvDocx`, `#/pvXlsx`).

### HR Assistant demo

The HR Assistant's knowledge base is four real files, kept in `sample-documents/hr-assistant/`:
`Employee handbook 2026.pdf`, `Leave policy.docx`, `Benefits overview.xlsx` and `Remote work policy.md`.
They are bundled into `src/services/hrSeedFiles.ts` as base64, because browser download managers intercept
requests for `.pdf` files. If you edit a file, regenerate that module.

1. Open **Chatbots → HR Assistant → Playground** and try the starter questions. Each one is answered from a
   policy:
   - "How many days of annual leave do I get?"
   - "When is payday?"
   - "Can I work from home?"
2. Ask "Is there a training budget for courses?". The chatbot says it doesn't know.
3. On the chatbot's **Knowledge base** tab, upload `sample-documents/Learning and development policy.pdf`
   and click **Add 1 to knowledge base**.
4. When the document is ready, click **Test in Playground** and ask the same question. The chatbot answers
   with the $1,000 yearly training budget and cites the new policy.

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS v4 (design tokens live in `src/index.css` under `@theme`)
- React Router (HashRouter) for prototype navigation

## Project layout

- `src/screens/` – one component per Figma frame (`ScreenNN<Key>.tsx`), registered in `src/screens/index.ts`
- `src/components/shared/` – blocks reused by several screens (sidebar, headers, cards, steppers...)
- `src/components/Stage.tsx` – scales the 1728×1117 frame to fit the window
- `src/lib/nav.ts` – `useGo()` click navigation and `useAutoNext()` timed transitions
- `public/icons/` – icons, logo and charts exported from Figma as SVG

Layout, spacing, colors and typography come straight from the Figma nodes (auto-layout → flexbox).
