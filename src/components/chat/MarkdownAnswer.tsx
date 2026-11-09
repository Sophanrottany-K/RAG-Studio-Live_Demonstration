// Shows chat answer text as it streams: new words fade in.
// MarkdownAnswer also shows prepared answers' headings, paragraphs, bullet lists, bold text and links.
import type { ReactNode } from "react";

/** One span per word, keyed by position, so only words that just arrived play the fade. */
export function fadingWords(text: string): ReactNode[] {
  return text.split(/(\s+)/).map((part, i) =>
    !part.trim() ? (
      part
    ) : (
      <span key={i} className="stream-word">
        {part}
      </span>
    ),
  );
}

function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|https?:\/\/\S+)/).map((part, i) => {
    if (part.startsWith("**")) return <strong key={i}>{fadingWords(part.slice(2, -2))}</strong>;
    if (part.startsWith("http"))
      return (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline stream-word">
          {part}
        </a>
      );
    return <span key={i}>{fadingWords(part)}</span>;
  });
}

/** Tidies text cut off mid-stream: hides a lone "##" or "-" and closes an open "**". */
function settle(partial: string) {
  const text = partial
    .replace(/\*+$/, "")
    .replace(/(^|\n)(#+|-)\s*$/, "")
    .trimEnd();
  return (text.match(/\*\*/g) ?? []).length % 2 ? `${text}**` : text;
}

export function MarkdownAnswer({ markdown }: { markdown: string }) {
  const blocks = settle(markdown)
    .split(/\n{2,}/)
    .filter(Boolean);
  return (
    <div className="max-w-[85%] flex flex-col items-start gap-3 font-gabarito text-[17px] leading-[26px] text-ink-body-2 [overflow-wrap:anywhere]">
      {blocks.map((block, i) => {
        if (block.startsWith("### "))
          return (
            <h4 key={i} className="pt-1 font-bold text-[17px] text-[#111111]">
              {fadingWords(block.slice(4))}
            </h4>
          );
        if (block.startsWith("## "))
          return (
            <h3 key={i} className="pt-2 first:pt-0 font-bold text-[20px] text-[#111111]">
              {fadingWords(block.slice(3))}
            </h3>
          );
        if (block.startsWith("- "))
          return (
            <ul key={i} className="list-disc pl-5 flex flex-col gap-1">
              {block.split("\n").map((item, j) => (
                <li key={j}>{inline(item.slice(2))}</li>
              ))}
            </ul>
          );
        return <p key={i}>{inline(block)}</p>;
      })}
    </div>
  );
}
