type PaginationControlsProps = {
  page: number;
  pageSize: number;
  totalItems: number;
  itemLabel?: string;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

function getVisiblePages(current: number, total: number): number[] {
  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  return Array.from(pages).filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
}

export default function PaginationControls({
  page,
  pageSize,
  totalItems,
  itemLabel = 'item',
  pageSizeOptions = [6, 10, 20, 50],
  onPageChange,
  onPageSizeChange,
}: PaginationControlsProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const startItem = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endItem = Math.min(safePage * pageSize, totalItems);
  const visiblePages = getVisiblePages(safePage, totalPages);

  return (
    <div className="mt-4 flex flex-col gap-3 border-t border-neutral-800 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-neutral-400">
        Menampilkan {startItem}-{endItem} dari {totalItems} {itemLabel}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <label className="text-xs text-neutral-400">
          Per halaman
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="ml-2 rounded-md border border-neutral-700 bg-neutral-950 px-2 py-1 text-xs text-neutral-200"
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={() => onPageChange(safePage - 1)}
          disabled={safePage <= 1}
          className="rounded-md border border-neutral-700 px-2.5 py-1 text-xs text-neutral-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Prev
        </button>

        {visiblePages.map((visiblePage) => (
          <button
            key={visiblePage}
            type="button"
            onClick={() => onPageChange(visiblePage)}
            className={`rounded-md border px-2.5 py-1 text-xs ${
              visiblePage === safePage
                ? 'border-[var(--accent)] bg-[var(--accent)]/25 text-white'
                : 'border-neutral-700 text-neutral-300'
            }`}
          >
            {visiblePage}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(safePage + 1)}
          disabled={safePage >= totalPages}
          className="rounded-md border border-neutral-700 px-2.5 py-1 text-xs text-neutral-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
