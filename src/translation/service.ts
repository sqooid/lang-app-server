import type { TranslationResult, Translator } from "./index";

export type TranslationService = {
  translate: (
    text: string,
    from: string,
    to: string,
  ) => Promise<TranslationResult>;
};

export const createTranslationService = (
  translator: Translator,
): TranslationService => ({
  translate: (text, from, to) => translator.translate(text, from, to),
});
