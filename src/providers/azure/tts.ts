import { logger } from "../../lib/logger";
import { normalizeLanguage } from "../../tts/index";
import type { Language, TTS } from "../../tts/index";

const LANG_TO_VOICE: Record<Language, string> = {
  en: "en-US-AvaMultilingualNeural",
  ja: "ja-JP-KeitaNeural",
  ko: "ko-KR-SunHiNeural",
  fr: "fr-FR-DeniseNeural",
  de: "de-DE-KatjaNeural",
  es: "es-ES-ElviraNeural",
  pt: "pt-BR-FranciscaNeural",
  it: "it-IT-ElsaNeural",
  "zh-Hans": "zh-CN-XiaoxiaoNeural",
  "zh-Hant": "zh-TW-HsiaoChenNeural",
};

const localeFromVoice = (voiceName: string): string =>
  voiceName.split("-").slice(0, 2).join("-");

export const createAzureTTS = (key: string, region: string): TTS => {
  return {
    textToSpeech: async (text, language) => {
      const normalized = normalizeLanguage(language);
      if (!normalized) {
        throw new Error(`Azure TTS: unsupported language "${language}"`);
      }

      logger.info(
        { text, language: normalized },
        "Azure TTS: synthesizing speech",
      );

      const voiceName = LANG_TO_VOICE[normalized];
      const locale = localeFromVoice(voiceName);
      const endpoint = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;

      const ssml = [
        `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${locale}">`,
        `  <voice name="${voiceName}">`,
        `    ${escapeXml(text)}`,
        `  </voice>`,
        `</speak>`,
      ].join("\n");

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": key,
          "Content-Type": "application/ssml+xml",
          "X-Microsoft-OutputFormat": "audio-16khz-64kbitrate-mono-mp3",
          "User-Agent": "lang-app",
        },
        body: new TextEncoder().encode(ssml),
      });

      if (!res.ok) {
        const body = await res.text();
        logger.error(
          {
            status: res.status,
            body,
            endpoint,
            headers: Object.fromEntries(res.headers.entries()),
          },
          "Azure TTS: request failed",
        );
        throw new Error(`Azure TTS error ${res.status}: ${body}`);
      }

      const audioBuffer = await res.arrayBuffer();
      const audioData = new Uint8Array(audioBuffer);

      logger.info(
        { audioSize: audioData.length },
        "Azure TTS: speech synthesis complete",
      );
      return { audio: audioData };
    },
  };
};

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
