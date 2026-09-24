import { loading } from "react-kui";
import { reloadForChunkError } from "./chunk-recovery";

let pendingLoads = 0;

// Suspense may retain the previous page during a navigation transition.
// Track the import itself, rather than relying on the fallback mounting.
export function withRouteLoading<T>(load: () => Promise<T>): () => Promise<T> {
  return async () => {
    // React.lazy calls its loader during render. Update the loading root after render.
    await Promise.resolve();
    if (pendingLoads++ === 0) loading.start();
    try {
      return await load();
    } catch (error) {
      if (reloadForChunkError(error)) {
        // Keep Suspense pending until navigation replaces this document.
        return new Promise<T>(() => {});
      }
      throw error;
    } finally {
      if (--pendingLoads === 0) loading.finish();
    }
  };
}
