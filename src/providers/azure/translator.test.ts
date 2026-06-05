import { describe, expect, it } from "bun:test";
import { createAzureTranslator } from "./translator";

describe("Azure Translator", () => {
  const key = process.env.AZURE_TRANSLATOR_KEY;
  const region = process.env.AZURE_TRANSLATOR_REGION;

  if (!key || !region) {
    throw new Error(
      "AZURE_TRANSLATOR_KEY and AZURE_TRANSLATOR_REGION must be set",
    );
  }

  const translator = createAzureTranslator(key, region);

  it("translates english to japanese", async () => {
    const result = await translator.translate(
      "this meeting could have been an email",
      "en",
      "ja",
    );

    expect(result.text).toBeString();
    expect(result.text.length).toBeGreaterThan(0);
    expect(result.billedCharacters).toBeNumber();
    expect(result.billedCharacters).toBeGreaterThan(0);
  });
});
