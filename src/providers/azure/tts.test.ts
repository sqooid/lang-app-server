import { describe, expect, it } from "bun:test";
import { createAzureTTS } from "./tts";

describe("Azure TTS", () => {
  const key = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION;

  if (!key || !region) {
    throw new Error("AZURE_SPEECH_KEY and AZURE_SPEECH_REGION must be set");
  }

  const tts = createAzureTTS(key, region);

  it("synthesizes japanese text to speech", async () => {
    const result = await tts.textToSpeech(
      "この会議はメールで済むかもしれません",
      "ja",
    );

    expect(result.audio).toBeInstanceOf(Uint8Array);
    expect(result.audio.length).toBeGreaterThan(0);

    await Bun.write("./test/speech.mp3", result.audio);
  });
});
