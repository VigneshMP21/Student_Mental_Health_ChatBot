function normalizeBaseUrl(url?: string) {
  const trimmed = url?.trim();

  if (!trimmed) {
    return "";
  }

  const withProtocol =
    trimmed.startsWith("http://") || trimmed.startsWith("https://")
      ? trimmed
      : `https://${trimmed}`;

  return withProtocol.endsWith("/") ? withProtocol : `${withProtocol}/`;
}

function isLocalBaseUrl(url: string) {
  try {
    const hostname = new URL(url).hostname;
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
  } catch {
    return false;
  }
}

export function getAppUrl(path = "", requestOrigin?: string) {
  const configuredBaseUrl =
    normalizeBaseUrl(process.env.NEXT_PUBLIC_APP_URL) ||
    normalizeBaseUrl(process.env.NEXT_PUBLIC_SITE_URL) ||
    normalizeBaseUrl(process.env.NEXT_PUBLIC_VERCEL_URL) ||
    normalizeBaseUrl(process.env.VERCEL_URL);
  const requestBaseUrl = normalizeBaseUrl(requestOrigin);
  const browserBaseUrl =
    (typeof window !== "undefined"
      ? normalizeBaseUrl(window.location.origin)
      : "");

  const baseUrl =
    requestBaseUrl &&
    !isLocalBaseUrl(requestBaseUrl) &&
    (!configuredBaseUrl || isLocalBaseUrl(configuredBaseUrl))
      ? requestBaseUrl
      : configuredBaseUrl || requestBaseUrl || browserBaseUrl || "http://localhost:3000/";

  return new URL(path.replace(/^\//, ""), baseUrl).toString();
}
