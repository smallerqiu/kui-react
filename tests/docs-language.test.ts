import { describe, expect, it } from "vitest";
import { localizeDocsPath, resolveDocsLanguage } from "../src/docs-language";

describe("documentation language routes", () => {
  it("uses the documentation URL as the source of truth", () => {
    expect(resolveDocsLanguage("/components/calendar", "en")).toBe("zh");
    expect(resolveDocsLanguage("/components/calendar-en", "zh")).toBe("en");
    expect(resolveDocsLanguage("/guide/quick-started", "en")).toBe("zh");
    expect(resolveDocsLanguage("/guide/quick-started-en", "zh")).toBe("en");
  });

  it("switches component and guide paths without duplicating the suffix", () => {
    expect(localizeDocsPath("/components/calendar", "en")).toBe("/components/calendar-en");
    expect(localizeDocsPath("/components/calendar-en", "zh")).toBe("/components/calendar");
    expect(localizeDocsPath("/guide/language-en", "en")).toBe("/guide/language-en");
    expect(localizeDocsPath("/playground", "zh")).toBe("/playground");
  });
});
