import Screen01An from "./Screen01An";
import Screen02Tpg from "./Screen02Tpg";
import Screen03Tch from "./Screen03Tch";
import Screen04List from "./Screen04List";
import Screen05S1e from "./Screen05S1e";
import Screen07S2 from "./Screen07S2";
import Screen09S3e from "./Screen09S3e";
import Screen13Created from "./Screen13Created";
import Screen16PvPdf from "./Screen16PvPdf";
import Screen17PvDocx from "./Screen17PvDocx";
import Screen18PvXlsx from "./Screen18PvXlsx";
import Screen19Pg from "./Screen19Pg";
import Screen20PgAns from "./Screen20PgAns";
import Screen21PgSrc from "./Screen21PgSrc";
import Screen23Ch0 from "./Screen23Ch0";
import Screen28CPub from "./Screen28CPub";
import Screen30GEmpty from "./Screen30GEmpty";
import Screen31GAns from "./Screen31GAns";
import Screen32GSrc from "./Screen32GSrc";
import Screen33GAns2 from "./Screen33GAns2";
import Screen34GOut from "./Screen34GOut";
import Screen38GNA from "./Screen38GNA";
import Screen39Paused2 from "./Screen39Paused2";
import Screen40KbDrop from "./Screen40KbDrop";
import Screen41KbAdded from "./Screen41KbAdded";
import Screen42KbReady from "./Screen42KbReady";
import Screen43Pg2 from "./Screen43Pg2";
import Screen44PgAns2 from "./Screen44PgAns2";
import Screen45Bot from "./Screen45Bot";

// One entry per Figma frame, in prototype order. The Create chatbot wizard is now one
// interactive screen per step, so its extra Figma states (s1f, s2q, s3u, s3f, s3l) alias them.
// Likewise the detail states (dDraft … paused) are one data-driven detail page (#/bot?id=…).
export const screens = [
  { path: "/", title: "Demo 01 · [an] A1 · Analytics overview", Component: Screen01An },
  { path: "/tpg", title: "Demo 02 · [tpg] A1 · Tour · Playground module", Component: Screen02Tpg },
  { path: "/tch", title: "Demo 03 · [tch] A1 · Tour · Channels module", Component: Screen03Tch },
  { path: "/list", title: "Demo 04 · [list] A2 · Chatbots list", Component: Screen04List },
  { path: "/s1e", title: "Demo 05 · [s1e] A2 · Step 1 · Basic info (empty)", Component: Screen05S1e },
  { path: "/s1f", title: "Demo 06 · [s1f] A2 · Step 1 · Basic info (filled)", Component: Screen05S1e },
  { path: "/s2", title: "Demo 07 · [s2] A2 · Step 2 · Model and behavior", Component: Screen07S2 },
  { path: "/s2q", title: "Demo 08 · [s2q] A2 · Step 2 · 4 starter questions", Component: Screen07S2 },
  { path: "/s3e", title: "Demo 09 · [s3e] A2 · Step 3 · Upload documents", Component: Screen09S3e },
  { path: "/s3u", title: "Demo 10 · [s3u] A2 · Step 3 · Files uploading", Component: Screen09S3e },
  { path: "/s3f", title: "Demo 11 · [s3f] A2 · Step 3 · Files added", Component: Screen09S3e },
  { path: "/s3l", title: "Demo 12 · [s3l] A2 · Step 3 · Files and website links", Component: Screen09S3e },
  { path: "/created", title: "Demo 13 · [created] A2 · Chatbot created", Component: Screen13Created },
  { path: "/dDraft", title: "Demo 14 · [dDraft] A2 · Detail · Draft (documents processing)", Component: Screen45Bot },
  { path: "/dPend", title: "Demo 15 · [dPend] A2 · Detail · Pending (all sources ready)", Component: Screen45Bot },
  { path: "/pvPdf", title: "Demo 16 · [pvPdf] A2 · All sources · PDF original", Component: Screen16PvPdf },
  { path: "/pvDocx", title: "Demo 17 · [pvDocx] A2 · All sources · DOCX original", Component: Screen17PvDocx },
  { path: "/pvXlsx", title: "Demo 18 · [pvXlsx] A2 · All sources · XLSX original", Component: Screen18PvXlsx },
  { path: "/pg", title: "Demo 19 · [pg] A3 · Playground", Component: Screen19Pg },
  { path: "/pgAns", title: "Demo 20 · [pgAns] A3 · Answer with references", Component: Screen20PgAns },
  { path: "/pgSrc", title: "Demo 21 · [pgSrc] A3 · Source citation", Component: Screen21PgSrc },
  { path: "/dPend2", title: "Demo 22 · [dPend2] A4 · Detail · Add channel", Component: Screen45Bot },
  { path: "/ch0", title: "Demo 23 · [ch0] A4 · Channels · none connected", Component: Screen23Ch0 },
  { path: "/ch1", title: "Demo 24 · [ch1] A4 · Channels · Telegram connected", Component: Screen23Ch0 },
  { path: "/ch2", title: "Demo 25 · [ch2] A4 · Channels · + Web widget", Component: Screen23Ch0 },
  { path: "/ch3", title: "Demo 26 · [ch3] A4 · Channels · + Public link", Component: Screen23Ch0 },
  { path: "/dReady", title: "Demo 27 · [dReady] A4 · Detail · ready to publish", Component: Screen45Bot },
  { path: "/cPub", title: "Demo 28 · [cPub] A4 · Confirm publish", Component: Screen28CPub },
  { path: "/active", title: "Demo 29 · [active] A4 · Published · Active", Component: Screen45Bot },
  { path: "/gEmpty", title: "Demo 30 · [gEmpty] A4 · Guest · Public link", Component: Screen30GEmpty },
  { path: "/gAns", title: "Demo 31 · [gAns] A4 · Guest · Answer with references", Component: Screen31GAns },
  { path: "/gSrc", title: "Demo 32 · [gSrc] A4 · Guest · Source document", Component: Screen32GSrc },
  { path: "/gAns2", title: "Demo 33 · [gAns2] A4 · Guest · Ask outside question", Component: Screen33GAns2 },
  { path: "/gOut", title: "Demo 34 · [gOut] A4 · Guest · Outside knowledge", Component: Screen34GOut },
  { path: "/active2", title: "Demo 35 · [active2] A5 · Detail · Active", Component: Screen45Bot },
  { path: "/cPause", title: "Demo 36 · [cPause] A5 · Confirm pause", Component: Screen45Bot },
  { path: "/paused", title: "Demo 37 · [paused] A5 · Detail · Paused", Component: Screen45Bot },
  { path: "/gNA", title: "Demo 38 · [gNA] A5 · Guest · Temporarily unavailable", Component: Screen38GNA },
  { path: "/paused2", title: "Demo 39 · [paused2] A6 · Paused · Knowledge base", Component: Screen39Paused2 },
  { path: "/kbDrop", title: "Demo 40 · [kbDrop] A6 · Knowledge base · Drop file", Component: Screen40KbDrop },
  { path: "/kbAdded", title: "Demo 41 · [kbAdded] A6 · Knowledge base · Processing", Component: Screen41KbAdded },
  { path: "/kbReady", title: "Demo 42 · [kbReady] A6 · Knowledge base · Document ready", Component: Screen42KbReady },
  { path: "/pg2", title: "Demo 43 · [pg2] A6 · Playground · Test again", Component: Screen43Pg2 },
  { path: "/pgAns2", title: "Demo 44 · [pgAns2] A6 · Answer from new knowledge", Component: Screen44PgAns2 },
  { path: "/bot", title: "Chatbot detail (live data)", Component: Screen45Bot },
];
