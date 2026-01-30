import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) {
        return null;
    }

    // Helper function to create a range of numbers
    const range = (start: number, end: number) =>
        Array.from({ length: (end - start) + 1 }, (_, i) => start + i);

    const getPaginationItems = () => {
        const siblingCount = 1;
        const totalPageNumbers = siblingCount + 5; // siblingCount + firstPage + lastPage + currentPage + 2*ellipsis

        if (totalPageNumbers >= totalPages) {
            return range(1, totalPages);
        }

        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(
            currentPage + siblingCount,
            totalPages
        );

        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

        const firstPageIndex = 1;
        const lastPageIndex = totalPages;

        if (!shouldShowLeftDots && shouldShowRightDots) {
            let leftItemCount = 3 + 2 * siblingCount;
            let leftRange = range(1, leftItemCount);
            return [...leftRange, '...', totalPages];
        }

        if (shouldShowLeftDots && !shouldShowRightDots) {
            let rightItemCount = 3 + 2 * siblingCount;
            let rightRange = range(
                totalPages - rightItemCount + 1,
                totalPages
            );
            return [firstPageIndex, '...', ...rightRange];
        }

        if (shouldShowLeftDots && shouldShowRightDots) {
            let middleRange = range(leftSiblingIndex, rightSiblingIndex);
            return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
        }
        
        return range(1, totalPages); // Fallback
    };

    const paginationItems = getPaginationItems();

    return (
        <nav className="flex items-center justify-center gap-3 mt-8" aria-label="Pagination">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 dark:bg-dark-300 bg-light-300 dark:text-slate-400 text-slate-600 hover:text-brand-primary hover:bg-brand-primary/10 disabled:opacity-30 disabled:cursor-not-allowed border border-transparent hover:border-brand-primary/20"
                aria-label="Go to previous page"
            >
                Prev
            </button>
            <div className="flex items-center gap-2 px-2 py-1 bg-light-200/50 dark:bg-dark-300/30 rounded-2xl border border-light-300/50 dark:border-dark-400/50">
                {paginationItems.map((item, index) => {
                     if (typeof item === 'string') {
                        return <span key={`ellipsis-${index}`} className="px-3 text-xs font-black text-slate-400">...</span>;
                    }
                    return (
                        <button
                            key={item}
                            onClick={() => onPageChange(item)}
                            className={`h-10 w-10 text-xs font-black rounded-xl transition-all duration-300 ${
                                currentPage === item
                                    ? 'bg-gradient-to-br from-brand-primary to-brand-secondary text-white shadow-lg shadow-brand-primary/20 scale-110 z-10'
                                    : 'dark:text-slate-500 text-slate-500 hover:text-brand-primary hover:bg-brand-primary/5'
                            }`}
                            aria-current={currentPage === item ? 'page' : undefined}
                            aria-label={`Go to page ${item}`}
                        >
                            {item}
                        </button>
                    )
                })}
            </div>
             <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 dark:bg-dark-300 bg-light-300 dark:text-slate-400 text-slate-600 hover:text-brand-primary hover:bg-brand-primary/10 disabled:opacity-30 disabled:cursor-not-allowed border border-transparent hover:border-brand-primary/20"
                aria-label="Go to next page"
            >
                Next
            </button>
        </nav>
    );
};

export default Pagination;