export function paginatedDTO(result, mapper) {
  return {
    data: result.data.map(mapper),
    pagination: result.pagination,
  };
}
