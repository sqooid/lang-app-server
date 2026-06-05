import type { TTS, TTSResult } from "./index";

export type TTSService = {
  textToSpeech: (text: string, language: string) => Promise<TTSResult>;
};

export const createTTSService = (tts: TTS): TTSService => ({
  textToSpeech: (text, language) => tts.textToSpeech(text, language),
});
