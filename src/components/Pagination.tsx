'use client';

import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { RiSkipLeftLine, RiSkipRightLine } from 'react-icons/ri';

interface PaginationProps {
    pageNumber: number;
    rowsPerPage: number;
    totalItems: number;
    totalPages:number;
    endPage:number;
    startPage:number;
    onPageChange: (newPage: number) => void;
    onRowsPerPageChange: (newRows: number) => void;
}

export default function Pagination({
    pageNumber,
    rowsPerPage,
    totalItems,
    totalPages,
    startPage,
    endPage,
    onPageChange,
    onRowsPerPageChange,
}: PaginationProps) {

    const startIndex = (pageNumber - 1) * rowsPerPage + 1;
    const endIndex = Math.min(pageNumber * rowsPerPage, totalItems);
    return (
        <div id='pagination' className="flex items-center justify-end gap-4 mt-10 text-sm">
            <div className="flex items-center gap-2">
                <span className='text-nowrap'>Items per page:</span>
                <select
                    className="select bg-base-200 border-x-0 border-t-0 !rounded-none border-b-[1px] focus:outline-none focus:ring-0	"
                    value={rowsPerPage}
                    onChange={(e) => onRowsPerPageChange(parseInt(e.target.value))}
                >
                    {[2, 5, 10, 20].map((n) => (
                        <option key={n} value={n}>
                            {n}
                        </option>
                    ))}
                </select>
            </div>

            <div className='min-w-[120px] flex justify-center'>
                {startIndex} - {endIndex} of {totalItems}
            </div>

            <div className="join">
                <button data-tip="First Page"
                    className="join-item btn tooltip "
                    disabled={pageNumber === startPage}
                    onClick={() => onPageChange(startPage)}
                >
                    <RiSkipLeftLine className='text-[24px]' />
                </button>
                <button  data-tip="Previous page"
                    className="join-item btn tooltip"
                    disabled={pageNumber === 1}
                    onClick={() => onPageChange(pageNumber - 1)}
                >
                    <FaChevronLeft className='text-[14px]' />
                </button>
                <button  data-tip='Next page'
                    className="join-item btn tooltip"
                    disabled={pageNumber === totalPages}
                    onClick={() => onPageChange(pageNumber + 1)}
                >
                    <FaChevronRight className='text-[14px]' />
                </button>
                <button data-tip='Last page'
                    className="join-item btn tooltip"
                    disabled={pageNumber === endPage}
                    onClick={() => onPageChange(endPage)}
                >
                    <RiSkipRightLine className='text-[24px]' />
                </button>
            </div>
        </div>
    );
}
