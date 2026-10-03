function Paginator({ page, totalPages, onPageChange, disabled = false }) {
  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="mt-6 flex items-center justify-center gap-4">
      <button
        type="button"
        disabled={page <= 1 || disabled}
        onClick={() => onPageChange(page - 1)}
        className="rounded-lg border px-4 py-2 disabled:opacity-50"
      >
        ก่อนหน้า
      </button>
      <span className="text-sm text-gray-600">หน้า {page} / {totalPages}</span>
      <button
        type="button"
        disabled={page >= totalPages || disabled}
        onClick={() => onPageChange(page + 1)}
        className="rounded-lg border px-4 py-2 disabled:opacity-50"
      >
        ถัดไป
      </button>
    </div>
  )
}

export default Paginator
