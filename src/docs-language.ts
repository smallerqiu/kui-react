export type DocsLanguage = "en" | "zh";

const isDocsPath = (pathname: string) => /^\/(?:components|guide)\/[^/]+\/?$/.test(pathname);

export function resolveDocsLanguage(
  pathname: string,
  storedLanguage?: string | null,
): DocsLanguage {
  if (isDocsPath(pathname)) return /-en\/?$/.test(pathname) ? "en" : "zh";
  return storedLanguage === "zh" ? "zh" : "en";
}

export function localizeDocsPath(pathname: string, language: DocsLanguage): string {
  if (!isDocsPath(pathname)) return pathname;
  const trailingSlash = pathname.endsWith("/") ? "/" : "";
  const path = pathname.replace(/\/$/, "").replace(/-en$/, "");
  return `${path}${language === "en" ? "-en" : ""}${trailingSlash}`;
}
