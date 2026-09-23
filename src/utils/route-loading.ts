import { loading } from "react-kui";

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
    } finally {
      if (--pendingLoads === 0) loading.finish();
    }
  };
}
