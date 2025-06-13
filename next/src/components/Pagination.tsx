interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > maxVisiblePages) {
      const half = Math.floor(maxVisiblePages / 2);
      startPage = Math.max(1, currentPage - half);
      endPage = Math.min(totalPages, currentPage + half);

      if (currentPage <= half + 1) {
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - half) {
        startPage = totalPages - maxVisiblePages + 1;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex justify-center mt-8">
      <nav className="inline-flex rounded-md shadow" aria-label="Pagination">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 ${
            currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label="Предыдущая страница"
        >
          &larr; Назад
        </button>

        {totalPages > 10 && currentPage > 3 && (
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-1 border-t border-b border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
          >
            1
          </button>
        )}

        {totalPages > 10 && currentPage > 4 && (
          <span className="px-3 py-1 border-t border-b border-gray-300 bg-white text-gray-500">
            ...
          </span>
        )}

        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 border-t border-b border-gray-300 ${
              currentPage === page
                ? 'bg-blue-500 text-white font-medium'
                : 'bg-white text-gray-500 hover:bg-gray-50'
            }`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        ))}

        {totalPages > 10 && currentPage < totalPages - 3 && (
          <span className="px-3 py-1 border-t border-b border-gray-300 bg-white text-gray-500">
            ...
          </span>
        )}

        {totalPages > 10 && currentPage < totalPages - 2 && (
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-1 border-t border-b border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
          >
            {totalPages}
          </button>
        )}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 ${
            currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label="Следующая страница"
        >
          Вперед &rarr;
        </button>
      </nav>
    </div>
  );
}