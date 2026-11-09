// Renders a Markdown file (.md) the way it reads, not as source: headings, paragraphs, bullet and numbered lists,
// tables, bold, italic, inline code and links. Styled like Word documents (.docx-original in index.css).
// The text stays plain DOM text, so the source viewer's passage highlight still finds it.
import type { ReactNode } from "react";

type Block =
  | { kind: "heading"; level: number; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "list"; ordered: boolean; items: string[] }
  | { kind: "table"; head: string[]; rows: string[][] }
  | { kind: "rule" };

const cells = (line: string) =>
  line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());

const isSeparator = (line: string) => /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?$/.test(line.trim());

/** The next non-blank line from `i`, for lists and tables written with blank lines between their rows. */
const nextFilled = (lines: string[], i: number) => {
  while (i < lines.length && !lines[i].trim()) i++;
  return i;
};

function parse(markdown: string): Block[] {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) {
      i++;
      continue;
    }
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      blocks.push({ kind: "heading", level: heading[1].length, text: heading[2] });
      i++;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line)) {
      blocks.push({ kind: "rule" });
      i++;
      continue;
    }
    if (line.startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        if (!isSeparator(lines[i])) rows.push(cells(lines[i]));
        const next = nextFilled(lines, i + 1);
        i = next < lines.length && lines[next].trim().startsWith("|") ? next : i + 1;
      }
      blocks.push({ kind: "table", head: rows[0] ?? [], rows: rows.slice(1) });
      continue;
    }
    const bullet = /^[-*+]\s+/;
    const numbered = /^\d+[.)]\s+/;
    if (bullet.test(line) || numbered.test(line)) {
      const marker = bullet.test(line) ? bullet : numbered;
      const items: string[] = [];
      while (i < lines.length && marker.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(marker, ""));
        const next = nextFilled(lines, i + 1);
        i = next < lines.length && marker.test(lines[next].trim()) ? next : i + 1;
      }
      blocks.push({ kind: "list", ordered: marker === numbered, items });
      continue;
    }
    // A paragraph runs until a blank line or the start of another block.
    const text: string[] = [];
    while (i < lines.length) {
      const l = lines[i].trim();
      if (!l || /^(#{1,6}\s|\||[-*+]\s|\d+[.)]\s)/.test(l)) break;
      text.push(l);
      i++;
    }
    blocks.push({ kind: "paragraph", text: text.join(" ") });
  }
  return blocks;
}

function inline(text: string): ReactNode[] {
  return text
    .split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\)|https?:\/\/[^\s)]+|\*[^*\s][^*]*\*)/)
    .map((part, i) => {
      if (!part) return null;
      if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{inline(part.slice(2, -2))}</strong>;
      if (part.startsWith("`") && part.endsWith("`"))
        return (
          <code key={i} className="font-geist-mono text-[13px] bg-[#F0F0EE] rounded px-1">
            {part.slice(1, -1)}
          </code>
        );
      const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
      if (link || /^https?:\/\//.test(part))
        return (
          <a key={i} href={link ? link[2] : part} target="_blank" rel="noopener noreferrer" className="underline">
            {link ? link[1] : part}
          </a>
        );
      if (part.length > 2 && part.startsWith("*") && part.endsWith("*")) return <em key={i}>{part.slice(1, -1)}</em>;
      return part;
    });
}

export function MarkdownDocument({ text }: { text: string }) {
  return (
    <div className="docx-original">
      {parse(text).map((block, i) => {
        switch (block.kind) {
          case "heading": {
            const Tag = (["h1", "h2", "h3", "h4", "h5", "h6"] as const)[block.level - 1];
            return <Tag key={i}>{inline(block.text)}</Tag>;
          }
          case "paragraph":
            return <p key={i}>{inline(block.text)}</p>;
          case "list": {
            const Tag = block.ordered ? "ol" : "ul";
            return (
              <Tag key={i}>
                {block.items.map((item, j) => (
                  <li key={j}>{inline(item)}</li>
                ))}
              </Tag>
            );
          }
          case "table":
            return (
              <table key={i}>
                <thead>
                  <tr>
                    {block.head.map((cell, j) => (
                      <th key={j} className="bg-[#F5F5F3] text-left font-semibold text-[#111111]">
                        {inline(cell)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, j) => (
                    <tr key={j}>
                      {row.map((cell, k) => (
                        <td key={k}>{inline(cell)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          case "rule":
            return <hr key={i} className="my-4 border-[#E4E4E0]" />;
        }
      })}
    </div>
  );
}
