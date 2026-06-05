import { Hono } from "hono";
import { createAzureTranslator } from "./providers/azure/translator";
import { createAzureTTS } from "./providers/azure/tts";
import { createTranslationService } from "./translation/service";
import { createTTSService } from "./tts/service";
import { logger } from "./lib/logger";

type Bindings = {
  API_KEY: string;
  AZURE_TRANSLATOR_KEY: string;
  AZURE_TRANSLATOR_REGION: string;
  AZURE_SPEECH_KEY: string;
  AZURE_SPEECH_REGION: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", async (c, next) => {
  const start = Date.now();

  let body: unknown;
  if (c.req.method !== "GET" && c.req.method !== "HEAD") {
    try {
      body = await c.req.raw.clone().json();
    } catch {
      body = await c.req.raw.clone().text();
    }
  }

  await next();
  logger.info(
    {
      method: c.req.method,
      path: c.req.path,
      status: c.res.status,
      duration: Date.now() - start,
      body,
    },
    "request",
  );
});

app.use("*", async (c, next) => {
  const apiKey = c.req.header("x-api-key");
  if (apiKey !== c.env.API_KEY) {
    return c.text("Unauthorized", 401);
  }
  await next();
});

app.post("/translate", async (c) => {
  const translator = createAzureTranslator(
    c.env.AZURE_TRANSLATOR_KEY,
    c.env.AZURE_TRANSLATOR_REGION,
  );
  const service = createTranslationService(translator);

  const body = await c.req.json<{ text: string; from: string; to: string }>();
  const result = await service.translate(body.text, body.from, body.to);
  return c.json(result);
});

app.post("/tts", async (c) => {
  const tts = createAzureTTS(c.env.AZURE_SPEECH_KEY, c.env.AZURE_SPEECH_REGION);
  const service = createTTSService(tts);

  const body = await c.req.json<{ text: string; language: string }>();
  const result = await service.textToSpeech(body.text, body.language);
  return c.body(result.audio.buffer as ArrayBuffer, 200, {
    "Content-Type": "audio/mpeg",
  });
});

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;
