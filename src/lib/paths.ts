const base = `${import.meta.env.BASE_URL.replace(/\/+$/, '')}/`;

export function withBase(path = '/'): string {
  const normalized = path.replace(/^\/+/, '');
  return `${base}${normalized}`.replace(/\/+/g, '/');
}
