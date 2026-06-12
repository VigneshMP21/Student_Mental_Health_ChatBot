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

export function getAppUrl(path = "") {
  const baseUrl =
    normalizeBaseUrl(process.env.NEXT_PUBLIC_APP_URL) ||
    normalizeBaseUrl(process.env.NEXT_PUBLIC_SITE_URL) ||
    normalizeBaseUrl(process.env.NEXT_PUBLIC_VERCEL_URL) ||
    (typeof window !== "undefined"
      ? normalizeBaseUrl(window.location.origin)
      : "http://localhost:3000/");

  return new URL(path.replace(/^\//, ""), baseUrl).toString();
}
