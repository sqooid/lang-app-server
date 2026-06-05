import { Hono } from "hono";
import { createAzureTranslator } from "./providers/azure/translator";
import { createAzureTTS } from "./providers/azure/tts";
import { createTranslationService } from "./translation/service";
import { createTTSService } from "./tts/service";
import { logger } from "./lib/logger";

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

app.use("*", async (c, next) => {
  const start = Date.now();
  await next();
  logger.info(
    {
      method: c.req.method,
      path: c.req.path,
      status: c.res.status,
      duration: Date.now() - start,
    },
    "request",
  );
});

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

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;
