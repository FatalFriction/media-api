import { PaginationMeta } from '../common/types/paginationTypes';

export function getPaginationMeta(
  total: number,
  currentPage: number,
  pageSize: number,
): PaginationMeta {
  return {
    total,
    currentPage,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    hasNextPage: currentPage * pageSize < total,
    hasPrevPage: currentPage > 1,
  };
}