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
        <nav className="flex items-center justify-center gap-2 mt-4" aria-label="Pagination">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm font-medium rounded-md transition-colors dark:bg-dark-300 bg-light-300 dark:text-dark-content text-light-content hover:bg-brand-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Go to previous page"
            >
                Prev
            </button>
            {paginationItems.map((item, index) => {
                 if (typeof item === 'string') {
                    return <span key={`ellipsis-${index}`} className="px-3 py-1 text-sm font-medium dark:text-dark-content text-light-content">...</span>;
                }
                return (
                    <button
                        key={item}
                        onClick={() => onPageChange(item)}
                        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                            currentPage === item
                                ? 'bg-brand-primary text-white'
                                : 'dark:bg-dark-300 bg-light-300 dark:text-dark-content text-light-content hover:bg-brand-primary/20'
                        }`}
                        aria-current={currentPage === item ? 'page' : undefined}
                        aria-label={`Go to page ${item}`}
                    >
                        {item}
                    </button>
                )
            })}
             <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm font-medium rounded-md transition-colors dark:bg-dark-300 bg-light-300 dark:text-dark-content text-light-content hover:bg-brand-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Go to next page"
            >
                Next
            </button>
        </nav>
    );
};

export default Pagination;