import { logger } from "../../lib/logger";
import type { TTS } from "../../tts/index";

const LANG_TO_VOICE: Record<string, string> = {
  en: "en-US-AvaMultilingualNeural",
  ja: "ja-JP-NanamiNeural",
  zh: "zh-CN-XiaoxiaoNeural",
  ko: "ko-KR-SunHiNeural",
  fr: "fr-FR-DeniseNeural",
  de: "de-DE-KatjaNeural",
  es: "es-ES-ElviraNeural",
  pt: "pt-BR-FranciscaNeural",
  it: "it-IT-ElsaNeural",
};

export const createAzureTTS = (key: string, region: string): TTS => {
  return {
    textToSpeech: async (text, language) => {
      logger.info({ text, language }, "Azure TTS: synthesizing speech");

      const voiceName = LANG_TO_VOICE[language] ?? LANG_TO_VOICE["en"];
      const endpoint = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;

      const ssml = `<speak version="1.0" xml:lang="${language}">
  <voice name="${voiceName}">
    ${escapeXml(text)}
  </voice>
</speak>`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": key,
          "Content-Type": "application/ssml+xml",
          "X-Microsoft-OutputFormat": "audio-16khz-128kbitrate-mono-mp3",
        },
        body: ssml,
      });

      if (!res.ok) {
        const body = await res.text();
        logger.error({ status: res.status, body }, "Azure TTS: request failed");
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
