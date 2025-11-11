import { PaginationMeta } from './paginationTypes';

export interface PaginationResult<T> {
  data: T[];
  meta: PaginationMeta;
}
