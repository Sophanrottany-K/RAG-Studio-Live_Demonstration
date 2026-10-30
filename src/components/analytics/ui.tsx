// Small building blocks of the RAG Studio web app's analytics screens (ragstudio-web-ui:
// components/ui/{status-pill,data-table,table-pagination}, components/layout/{page-header,app-breadcrumb}).
import { Fragment, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, CircleArrowLeft, Ellipsis } from "lucide-react";
import { useGo } from "../../lib/nav";
import { cn, type PillTone } from "./format";

/** Top bar of the page: title and a short description. Sticky, edge to edge of the p-8 content area. */
export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <header className="border-line bg-card sticky -top-8 z-10 -mx-8 -mt-8 border-b px-8 py-4">
      <h1 className="text-s1 text-ink">{title}</h1>
      {description && <p className="text-c1 text-ink-secondary">{description}</p>}
    </header>
  );
}

/** Back arrow + "Parent / Current" trail. */
export function AppBreadcrumb({ items }: { items: { label: string; to?: string }[] }) {
  const go = useGo();
  const back = items[0]?.to;
  return (
    <div className="flex items-center gap-2">
      {back && (
        <button type="button" aria-label="Go back" className="text-ink-muted hover:text-ink cursor-pointer" onClick={go(back)}>
          <CircleArrowLeft className="size-4" aria-hidden />
        </button>
      )}
      <nav aria-label="breadcrumb">
        <ol className="text-p3 text-ink-secondary flex flex-wrap items-center gap-2">
          {items.map((item, i) => {
            const last = i === items.length - 1;
            return (
              <Fragment key={item.label}>
                <li className="inline-flex items-center gap-1">
                  {item.to && !last ? (
                    <button
                      type="button"
                      className="text-ink-secondary hover:text-ink cursor-pointer transition-colors"
                      onClick={go(item.to)}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <span aria-current="page" className="text-p4 text-ink">
                      {item.label}
                    </span>
                  )}
                </li>
                {!last && (
                  <li role="presentation" aria-hidden className="text-ink-muted">
                    {"/"}
                  </li>
                )}
              </Fragment>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}

const pillTone: Record<PillTone, string> = {
  success: "bg-success-tint text-success-text",
  warning: "bg-warning-tint text-warning-text",
  danger: "bg-danger-tint text-danger-text",
  info: "bg-info-tint text-info-text",
  neutral: "bg-neutral-tint text-neutral-text",
};

/** Small status label (ACTIVE, PAUSED, OPEN, ...). `plain` is the smaller, sentence-case version used in tables. */
export function StatusPill({
  tone,
  plain = false,
  className,
  children,
}: {
  tone: PillTone;
  plain?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "rounded-pill inline-flex items-center justify-center border border-current/30",
        plain ? "text-c1 gap-1 px-2 py-0.5" : "text-c2 min-w-20 gap-1.5 px-3 py-1 font-mono tracking-widest uppercase",
        pillTone[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Small white pill in a card's top right corner ("8.2%", "Live", "Indexed"). */
export function StatBadge({ children, className = "text-success-text" }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("bg-card rounded-pill text-c2 inline-flex items-center gap-1 px-3 py-1", className)}>
      {children}
    </span>
  );
}

export type DataTableColumn<T> = {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  /** Content of the footer row (e.g. a total). The footer shows when any column has one. */
  footer?: ReactNode;
  /** Classes for this column's header and cells (width, alignment, wrapping). */
  className?: string;
};

/** Cells don't wrap unless the column sets its own whitespace-* class (cn joins, it doesn't merge). */
const noWrap = (className?: string) => !className?.includes("whitespace-") && "whitespace-nowrap";

/** Black rounded header bar, then rows split by thin lines. Cells don't wrap unless a column adds `whitespace-normal`. */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  caption,
  emptyText = "Nothing to show yet.",
  onRowClick,
  className,
}: {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  caption: string;
  emptyText?: string;
  onRowClick?: (row: T) => void;
  className?: string;
}) {
  const hasFooter = columns.some((c) => c.footer !== undefined);
  return (
    <div className={cn("relative w-full overflow-x-auto", className)}>
      <table className="text-p3 w-full caption-bottom">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                className={cn(
                  "bg-inverse text-on-inverse text-eyebrow first:rounded-l-small last:rounded-r-small h-12 px-4 text-left align-middle font-mono whitespace-nowrap uppercase",
                  c.className?.replace(/whitespace-\S+/g, ""),
                )}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={hasFooter ? "[&_tr:last-child]:border-b" : "[&_tr:last-child]:border-0"}>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-ink-muted px-4 py-8 text-center">
                {emptyText}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={rowKey(row)}
                className={cn("border-line hover:bg-subtle border-b transition-colors", onRowClick && "cursor-pointer")}
                {...(onRowClick && {
                  tabIndex: 0,
                  onClick: () => onRowClick(row),
                  onKeyDown: (e: React.KeyboardEvent) => {
                    if (e.key === "Enter" && e.target === e.currentTarget) onRowClick(row);
                  },
                })}
              >
                {columns.map((c) => (
                  <td key={c.key} className={cn("text-ink-body px-4 py-5 align-middle", noWrap(c.className), c.className)}>
                    {c.cell(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
        {hasFooter && (
          <tfoot>
            <tr>
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={cn("text-ink px-4 py-5 align-middle font-bold", noWrap(c.className), c.className)}
                >
                  {c.footer}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}

const pageButton =
  "rounded-pill text-btn-sm text-ink hover:bg-muted disabled:text-ink-disabled inline-flex h-10 min-w-10 cursor-pointer items-center justify-center gap-1.5 px-3 transition-colors disabled:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

/** "Showing X of Y" on the left, page buttons on the right; hidden runs of pages become "…". */
export function TablePagination({
  page,
  pageSize,
  total,
  itemLabel,
  onPageChange,
  className,
}: {
  page: number;
  pageSize: number;
  total: number;
  itemLabel: string;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const shown = Math.max(0, Math.min(pageSize, total - (page - 1) * pageSize));
  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-4", className)}>
      <p className="text-p3 text-ink-muted">
        {`Showing ${formatCount(shown)} of ${formatCount(total)} ${itemLabel}`}
      </p>
      <nav aria-label="pagination" className="flex">
        <ul className="bg-subtle rounded-pill flex flex-row items-center gap-1 p-1.5">
          <li>
            <button
              type="button"
              className={cn(pageButton, "tracking-wider uppercase")}
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
            >
              <ChevronLeft />
              <span>{"Prev"}</span>
            </button>
          </li>
          {getPageItems(page, pageCount).map((item, i) => (
            <li key={item === "ellipsis" ? `e${i}` : item}>
              {item === "ellipsis" ? (
                <span aria-hidden className="text-ink-muted flex size-10 items-center justify-center">
                  <Ellipsis className="size-4" />
                </span>
              ) : (
                <button
                  type="button"
                  aria-current={item === page ? "page" : undefined}
                  aria-label={`Page ${item}`}
                  className={cn(pageButton, item === page && "bg-inverse text-on-inverse hover:bg-inverse")}
                  onClick={() => onPageChange(item)}
                >
                  {item}
                </button>
              )}
            </li>
          ))}
          <li>
            <button
              type="button"
              className={cn(pageButton, "tracking-wider uppercase")}
              disabled={page >= pageCount}
              onClick={() => onPageChange(page + 1)}
            >
              <span>{"Next"}</span>
              <ChevronRight />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

const formatCount = (n: number) => n.toLocaleString("en-US");

/** Page 1 of 214 → [1, 2, 3, "ellipsis", 214]. */
function getPageItems(page: number, pageCount: number): (number | "ellipsis")[] {
  const pages = new Set([1, pageCount, page - 1, page, page + 1]);
  if (page <= 2) pages.add(3);
  if (page >= pageCount - 1) pages.add(pageCount - 2);
  const sorted = [...pages].filter((p) => p >= 1 && p <= pageCount).sort((a, b) => a - b);
  const items: (number | "ellipsis")[] = [];
  sorted.forEach((p, i) => {
    const prev = sorted[i - 1];
    if (prev !== undefined && p - prev === 2) items.push(prev + 1);
    else if (prev !== undefined && p - prev > 2) items.push("ellipsis");
    items.push(p);
  });
  return items;
}
