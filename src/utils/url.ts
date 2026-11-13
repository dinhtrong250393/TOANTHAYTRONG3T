/**
 * Normalizes a user-entered URL by prepending https:// if no protocol is present.
 */
export function normalizeUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/**
 * Validates that a URL is a valid http(s) web address.
 */
export function isValidWebUrl(rawUrl: string): boolean {
  const normalized = normalizeUrl(rawUrl);
  if (!normalized) return false;
  try {
    const parsed = new URL(normalized);
    return (
      (parsed.protocol === 'http:' || parsed.protocol === 'https:') &&
      parsed.hostname.includes('.')
    );
  } catch {
    return false;
  }
}

/**
 * Extracts a clean display domain (e.g., "notion.so") from a URL.
 */
export function getDisplayDomain(rawUrl: string): string {
  const normalized = normalizeUrl(rawUrl);
  try {
    const parsed = new URL(normalized);
    return parsed.hostname.replace(/^www\./i, '');
  } catch {
    return rawUrl;
  }
}

/**
 * Suggests a high-resolution favicon URL via Google S2 service for a given web app URL.
 */
export function getFaviconSuggestion(rawUrl: string): string {
  const normalized = normalizeUrl(rawUrl);
  try {
    const parsed = new URL(normalized);
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(
      parsed.hostname,
    )}&sz=128`;
  } catch {
    return '';
  }
}
