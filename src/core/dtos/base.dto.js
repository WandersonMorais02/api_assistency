export function toId(value) {
  if (!value) return null;

  if (value._id) {
    return String(value._id);
  }

  return String(value);
}

export function toDate(value) {
  if (!value) return null;

  return new Date(value).toISOString();
}

export function mapArray(items, mapper) {
  if (!Array.isArray(items)) return [];

  return items.map(mapper);
}

export function removeEmptyFields(data) {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined)
  );
}
