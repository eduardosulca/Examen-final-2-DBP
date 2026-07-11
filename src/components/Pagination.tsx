interface Props {
  page: number; // 0-indexed
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}

export default function Pagination({ page, totalPages, onPrevious, onNext }: Props) {
  if (totalPages <= 0) return null;

  return (
    <div className="flex items-center justify-center gap-4 pt-6 font-body text-sm">
      <button
        onClick={onPrevious}
        disabled={page <= 0}
        className="rounded-md border border-edge px-4 py-2 text-white/80 disabled:opacity-30 disabled:cursor-not-allowed hover:border-signal/50 transition"
      >
        ← Previous
      </button>
      <span className="text-white/50 font-mono">
        Página {page + 1} de {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={page >= totalPages - 1}
        className="rounded-md border border-edge px-4 py-2 text-white/80 disabled:opacity-30 disabled:cursor-not-allowed hover:border-signal/50 transition"
      >
        Next →
      </button>
    </div>
  );
}
