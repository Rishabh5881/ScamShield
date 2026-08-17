const URL_PATTERN = /https?:\/\/[^\s<>"'`]+/gi;

export function extractUrls(text) {
  if (!text || typeof text !== "string") {
    return [];
  }

  const matches = text.match(URL_PATTERN);

  if (!matches) {
    return [];
  }

  return [...new Set(matches)];
}