/**
 * Normalize a photo path stored in the DB into a fully-qualified URL.
 *
 * Handles three historic formats:
 *   "/storage/uploads/photos/..."  — old accessor output (403 Forbidden)
 *   "/storage/public/uploads/..."  — another old variant
 *   "/uploads/photos/..."          — current correct format
 */
const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

export function getPhotoUrl(path: string | null | undefined): string {
  if (!path) return '';
  // Strip any leading /storage prefix (leftover from pre-fix Eloquent accessor)
  const cleaned = path.replace(/^\/storage\/?(public\/)?/, '/');
  // Make sure it starts with a single slash before the backend URL
  const normalized = cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
  return `${BACKEND_URL}${normalized}`;
}
