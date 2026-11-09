// Finds the passage an answer was retrieved from inside a rendered document and highlights it.
// Uses the CSS Custom Highlight API (`::highlight(rag-passage)` in index.css), so React's DOM is never changed.
import { useEffect, useState, type RefObject } from "react";

const HIGHLIGHT = "rag-passage";
/** Letters, combining marks (Khmer, accents) and digits. Punctuation and spacing differ between the text the
 *  answer engine read and the rendered document (CSV commas, added full stops, line breaks), so they are ignored. */
const WORD_CHAR = /[\p{L}\p{M}\p{N}]/u;
/** Pieces of the passage shorter than this are too likely to match somewhere else. */
const MIN_PIECE = 12;

type Index = { text: string; at: { node: Text; offset: number }[] };

function indexText(root: HTMLElement): Index {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let text = "";
  const at: Index["at"] = [];
  for (let node = walker.nextNode() as Text | null; node; node = walker.nextNode() as Text | null) {
    const value = node.data;
    for (let i = 0; i < value.length; i++) {
      if (!WORD_CHAR.test(value[i])) continue;
      text += value[i].toLowerCase().charAt(0);
      at.push({ node, offset: i });
    }
  }
  return { text, at };
}

const normalize = (value: string) =>
  Array.from(value)
    .filter((c) => WORD_CHAR.test(c))
    .map((c) => c.toLowerCase().charAt(0))
    .join("");

/** The passage as a whole, or else sentence by sentence (in order), so that a small difference doesn't lose it. */
function findRanges(root: HTMLElement, passage: string): Range[] {
  const index = indexText(root);
  if (!index.text) return [];
  const whole = normalize(passage.replace(/…$/, ""));
  const pieces =
    whole.length >= MIN_PIECE && index.text.includes(whole)
      ? [whole]
      : passage
          .replace(/…$/, "")
          .split(/(?<=[.!?;:])\s+|\n+/)
          .map(normalize)
          .filter((p) => p.length >= MIN_PIECE);
  const ranges: Range[] = [];
  let from = 0;
  for (const piece of pieces) {
    const start = index.text.indexOf(piece, from);
    if (start < 0) continue;
    const end = start + piece.length - 1;
    const range = document.createRange();
    range.setStart(index.at[start].node, index.at[start].offset);
    range.setEnd(index.at[end].node, index.at[end].offset + 1);
    ranges.push(range);
    from = end + 1;
  }
  return ranges;
}

/**
 * Highlights `passage` inside `container` and scrolls it into view. Documents render in steps (a PDF page at a
 * time, a DOCX after conversion), so it looks again whenever the content changes, until the passage is found.
 * Returns whether it was found.
 */
export function usePassageHighlight(container: RefObject<HTMLElement>, passage: string | undefined) {
  const [found, setFound] = useState(false);

  useEffect(() => {
    const root = container.current;
    if (!root || !passage?.trim()) return;
    const registry = typeof CSS !== "undefined" && "highlights" in CSS ? CSS.highlights : null;
    let timer = 0;
    let done = false;

    const look = () => {
      if (done) return;
      const ranges = findRanges(root, passage);
      if (!ranges.length) return;
      done = true;
      observer.disconnect();
      registry?.set(HIGHLIGHT, new Highlight(...ranges));
      setFound(true);
      const element = ranges[0].startContainer.parentElement;
      if (element && element.getBoundingClientRect().height > root.clientHeight * 0.8) {
        // Plain text (.md, .txt) is one big element: centring it would land mid-document, so scroll the viewer
        // to the passage itself, a little below the top.
        const top = ranges[0].getBoundingClientRect().top - root.getBoundingClientRect().top;
        root.scrollBy({ top: top - 80, behavior: "smooth" });
      } else {
        // Whichever element scrolls (the viewer, or a spreadsheet's own grid) brings the passage into view.
        element?.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" });
      }
    };

    const observer = new MutationObserver(() => {
      clearTimeout(timer);
      timer = window.setTimeout(look, 120);
    });
    observer.observe(root, { childList: true, subtree: true, characterData: true });
    look();

    return () => {
      done = true;
      observer.disconnect();
      clearTimeout(timer);
      registry?.delete(HIGHLIGHT);
      setFound(false);
    };
  }, [container, passage]);

  return found;
}
