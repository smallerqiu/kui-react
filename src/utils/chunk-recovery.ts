const reloadKey = "react-kui:chunk-reload";
const retryInterval = 60_000;

// A deployment can remove chunks referenced by an already-open documentation page.
export function reloadForChunkError(
  error: unknown,
  reload: () => void = () => window.location.reload(),
): boolean {
  const message = error instanceof Error ? error.message : String(error);
  if (
    !/Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Unable to preload CSS/i.test(
      message,
    )
  )
    return false;

  try {
    const previous = window.sessionStorage.getItem(reloadKey);
    const now = Date.now();
    // Keep this marker across reloads, including when cached HTML is still stale.
    if (previous !== null && now - Number(previous) < retryInterval) return false;
    window.sessionStorage.setItem(reloadKey, String(now));
  } catch {
    // Without persistent protection, an automatic reload could loop indefinitely.
    return false;
  }
  reload();
  return true;
}
