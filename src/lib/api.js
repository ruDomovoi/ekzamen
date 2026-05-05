const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function apiUrl(path) {
  if (!path.startsWith('/')) {
    return `${API_BASE}/${path}`;
  }
  return `${API_BASE}${path}`;
}
