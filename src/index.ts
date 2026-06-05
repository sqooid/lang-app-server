import { Hono } from "hono";
import { createAzureTranslator } from "./providers/azure/translator";
import { createAzureTTS } from "./providers/azure/tts";
import { createTranslationService } from "./translation/service";
import { createTTSService } from "./tts/service";

const translationService = createTranslationService(
  createAzureTranslator(
    process.env.AZURE_TRANSLATOR_KEY!,
    process.env.AZURE_TRANSLATOR_REGION!,
  ),
);

const ttsService = createTTSService(
  createAzureTTS(
    process.env.AZURE_SPEECH_KEY!,
    process.env.AZURE_SPEECH_REGION!,
  ),
);

const app = new Hono();

app.post("/translate", async (c) => {
  const body = await c.req.json<{ text: string; from: string; to: string }>();
  const result = await translationService.translate(
    body.text,
    body.from,
    body.to,
  );
  return c.json(result);
});

app.post("/tts", async (c) => {
  const body = await c.req.json<{ text: string; language: string }>();
  const result = await ttsService.textToSpeech(body.text, body.language);
  return c.body(result.audio.buffer as ArrayBuffer, 200, {
    "Content-Type": "audio/mpeg",
  });
});

export default app;
