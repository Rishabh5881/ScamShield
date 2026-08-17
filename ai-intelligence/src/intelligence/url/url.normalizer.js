export function normalizeUrl(input) {
  if (!input || typeof input !== "string") {
    return null;
  }

  try {
    const url = new URL(input.trim());

    return {
      original: input,
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