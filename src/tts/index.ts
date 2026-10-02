export type TTSResult = {
  audio: Uint8Array;
};

export type TTS = {
  textToSpeech: (text: string, language: string) => Promise<TTSResult>;
};

export const LANGUAGES = [
  "en",
  "ja",
  "ko",
  "fr",
  "de",
  "es",
  "pt",
  "it",
  "zh-Hans",
  "zh-Hant",
] as const;

export type Language = (typeof LANGUAGES)[number];

/**
 * BCP-47 aliases -> canonical language. Chinese dialects are kept distinct:
 * zh / zh-CN / zh-SG / cmn -> zh-Hans (Mandarin, Simplified),
 * zh-TW / zh-Hant -> zh-Hant (Mandarin, Traditional).
 * Cantonese (yue / zh-HK) is deliberately absent so it is rejected rather
 * than mispronounced as Mandarin; add it here plus a voice when supported.
 */
const LANGUAGE_ALIASES: Record<string, Language> = {
  en: "en",
  "en-us": "en",
  "en-gb": "en",
  ja: "ja",
  "ja-jp": "ja",
  ko: "ko",
  "ko-kr": "ko",
  fr: "fr",
  "fr-fr": "fr",
  de: "de",
  "de-de": "de",
  es: "es",
  "es-es": "es",
  pt: "pt",
  "pt-br": "pt",
  "pt-pt": "pt",
  it: "it",
  "it-it": "it",
  zh: "zh-Hans",
  "zh-hans": "zh-Hans",
  "zh-cn": "zh-Hans",
  "zh-sg": "zh-Hans",
  "zh-hans-cn": "zh-Hans",
  cmn: "zh-Hans",
  "cmn-hans": "zh-Hans",
  "zh-cmn-hans": "zh-Hans",
  "zh-hant": "zh-Hant",
  "zh-tw": "zh-Hant",
  "zh-hant-tw": "zh-Hant",
  "cmn-hant": "zh-Hant",
};

export const normalizeLanguage = (input: string): Language | undefined =>
  LANGUAGE_ALIASES[input.trim().toLowerCase().replace(/_/g, "-")];
