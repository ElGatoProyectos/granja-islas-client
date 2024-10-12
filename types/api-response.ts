export interface TypePagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

export interface TypeResponseApi<T> {
  error: boolean;
  statusCode: number;
  message: string;
  payload: T;
}

export interface TypePaginationNode<T> {
  total: number;
  page: number;
  limit: number;
  pageCount: number;
  data: T;
}
