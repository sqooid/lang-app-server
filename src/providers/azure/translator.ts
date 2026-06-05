import { logger } from "../../lib/logger";
import type { Translator } from "../../translation/index";

interface AzureTranslationResponse {
  translations: { text: string; to: string }[];
}

export const createAzureTranslator = (
  key: string,
  region: string,
): Translator => {
  return {
    translate: async (text, from, to) => {
      logger.info({ text, from, to }, "Azure Translator: translating");

      const endpoint =
        "https://api.cognitive.microsofttranslator.com/translate";
      const params = new URLSearchParams({
        "api-version": "3.0",
        from,
        to,
      });

      const res = await fetch(`${endpoint}?${params}`, {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": key,
          "Ocp-Apim-Subscription-Region": region,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([{ Text: text }]),
      });

      if (!res.ok) {
        const body = await res.text();
        logger.error(
          { status: res.status, body },
          "Azure Translator: request failed",
        );
        throw new Error(`Azure Translator error ${res.status}: ${body}`);
      }

      const data = (await res.json()) as AzureTranslationResponse[];
      const translation = data[0]?.translations[0];

      if (!translation) {
        logger.error({ data }, "Azure Translator: no translation in response");
        throw new Error("Azure Translator: no translation in response");
      }

      const billedCharacters = parseInt(
        res.headers.get("X-Metered-Usage") ?? "0",
        10,
      );

      logger.info(
        { translatedText: translation.text, billedCharacters },
        "Azure Translator: translation complete",
      );
      return { text: translation.text, billedCharacters };
    },
  };
};
