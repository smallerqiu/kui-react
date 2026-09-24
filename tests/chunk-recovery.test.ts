import { afterEach, describe, expect, it, vi } from "vitest";
import { reloadForChunkError } from "../src/utils/chunk-recovery";

afterEach(() => {
  vi.restoreAllMocks();
  sessionStorage.clear();
});

describe("stale documentation chunk recovery", () => {
  it.each([
    "Failed to fetch dynamically imported module: /js/page-old.js",
    "Importing a module script failed.",
    "error loading dynamically imported module: /js/page-old.js",
    "Unable to preload CSS for /css/page-old.css",
  ])("reloads for %s", (message) => {
    const reload = vi.fn();
    expect(reloadForChunkError(new TypeError(message), reload)).toBe(true);
    expect(reload).toHaveBeenCalledOnce();
  });

  it("does not reload for application errors", () => {
    const reload = vi.fn();
    expect(reloadForChunkError(new Error("Cannot read properties of undefined"), reload)).toBe(
      false,
    );
    expect(reload).not.toHaveBeenCalled();
  });

  it("limits retries across page loads and allows recovery from a later deployment", () => {
    const reload = vi.fn();
    const now = vi.spyOn(Date, "now").mockReturnValue(100_000);
    const error = new Error("Failed to fetch dynamically imported module");
    expect(reloadForChunkError(error, reload)).toBe(true);
    expect(reloadForChunkError(error, reload)).toBe(false);
    now.mockReturnValue(160_001);
    expect(reloadForChunkError(error, reload)).toBe(true);
    expect(reload).toHaveBeenCalledTimes(2);
  });

  it("does not risk a reload loop when session storage is unavailable", () => {
    vi.spyOn(window, "sessionStorage", "get").mockImplementation(() => {
      throw new Error("blocked");
    });
    const reload = vi.fn();
    expect(
      reloadForChunkError(new Error("Failed to fetch dynamically imported module"), reload),
    ).toBe(false);
    expect(reload).not.toHaveBeenCalled();
  });
});
