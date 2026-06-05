export type TTSResult = {
  audio: Uint8Array;
};

export type TTS = {
  textToSpeech: (text: string, language: string) => Promise<TTSResult>;
};
