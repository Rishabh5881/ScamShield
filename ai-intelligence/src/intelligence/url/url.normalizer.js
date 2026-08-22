export function normalizeUrl(input) {
  if (!input || typeof input !== "string") {
    return null;
  }

  const value = input.trim();

  if (!value || value.length > 2048) {
    return null;
  }

  try {
    const url = new URL(value);

    // Only web URLs are allowed.
    if (
      url.protocol !== "http:" &&
      url.protocol !== "https:"
    ) {
      return null;
    }

    // Username/password in a URL are suspicious
    // but must remain static data only.
    return {
      original: value,
      href: url.href,
      protocol: url.protocol.replace(":", ""),
      hostname: url.hostname.toLowerCase(),
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
      port: url.port || null,
      username: url.username || null,
      password: url.password || null,
    };
  } catch {
    return null;
  }
}