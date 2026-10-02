import { describe, expect, it } from "bun:test";
import { normalizeLanguage } from "./index";

describe("normalizeLanguage", () => {
  it("maps BCP-47 variants and casing to canonical keys", () => {
    expect(normalizeLanguage("EN_us")).toBe("en");
    expect(normalizeLanguage("ja-JP")).toBe("ja");
    expect(normalizeLanguage("pt-BR")).toBe("pt");
  });

  it("collapses Mandarin variants to zh-Hans", () => {
    expect(normalizeLanguage("zh")).toBe("zh-Hans");
    expect(normalizeLanguage("zh-CN")).toBe("zh-Hans");
    expect(normalizeLanguage("zh-Hans")).toBe("zh-Hans");
    expect(normalizeLanguage("cmn-Hans")).toBe("zh-Hans");
  });

  it("keeps Traditional Mandarin separate from Simplified", () => {
    expect(normalizeLanguage("zh-Hant")).toBe("zh-Hant");
    expect(normalizeLanguage("zh-TW")).toBe("zh-Hant");
  });

  it("rejects Cantonese and unknown codes instead of falling back", () => {
    expect(normalizeLanguage("zh-HK")).toBeUndefined();
    expect(normalizeLanguage("yue")).toBeUndefined();
    expect(normalizeLanguage("xx")).toBeUndefined();
  });
});
